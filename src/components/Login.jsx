import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';
import FormContainer from './FormContainer.jsx';

const Login = () => {
  const auth = useAuth();
  const [error, setError] = useState(null);
  const history = useHistory();

  const { t } = useTranslation();

  const usernameRef = useRef();

  const redirectAuthorized = useCallback(
    () => {
      if (auth.loggedIn) {
        history.replace('/');
      }
    },
    [auth.loggedIn, history],
  );

  useEffect(() => {
    redirectAuthorized();
    usernameRef.current.focus();
  }, [redirectAuthorized]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    const url = routes.login();

    setError(null);

    try {
      const res = await axios.post(url, { ...values }, { timeout: 10000, timeoutErrorMessage: 'Network Error' });

      auth.logIn(res.data);

      history.replace('/');
    } catch (e) {
      if (e.isAxiosError) {
        if (e.response && e.response.status === 401) {
          setError('authFailed');
          usernameRef.current.select();
        } else if (e.message === 'Network Error') {
          setError('netError');
        }
      }

      if (error) {
        setError('unknown');
        console.error(e);
      }

      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit,
  });

  return (
    <FormContainer>
      <Form data-testid="login-form" className="p-3" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">{t('labels.yourNickname')}</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            readOnly={formik.isSubmitting}
            ref={usernameRef}
            isInvalid={!!error}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">{t('labels.password')}</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="current-password"
            required
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            readOnly={formik.isSubmitting}
            isInvalid={!!error}
          />
          {error
            && <Form.Control.Feedback type="invalid">{t(`errors.${error}`)}</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          variant="outline-primary"
          className="w-100 mb-3"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            && <Spinner className="mr-1" animation="border" size="sm" />}
          {t('buttons.logIn')}
        </Button>
        <div className="text-center">
          <span>
            {t('texts.noAccount')}
            &nbsp;
            <Link to="/signup">{t('texts.registration')}</Link>
          </span>
        </div>
      </Form>
    </FormContainer>
  );
};

export default Login;
