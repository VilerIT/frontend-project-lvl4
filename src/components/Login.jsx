import React, { useEffect, useRef, useState } from 'react';
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
  const [authFailed, setAuthFailed] = useState(false);
  const history = useHistory();

  const { t } = useTranslation();

  const usernameRef = useRef();

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace('/');
    }

    usernameRef.current.focus();
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    const url = routes.login();

    setAuthFailed(false);

    try {
      const res = await axios.post(url, { ...values });

      auth.logIn(res.data);

      history.replace('/');
    } catch (e) {
      /* if (e.isAxiosError && e.response.status === 401) {
        setAuthFailed(true);
        usernameRef.current.select();
        return;
      }

      throw e; */
      setAuthFailed(true);
      setSubmitting(false);
      usernameRef.current.select();
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
      <Form className="p-3" onSubmit={formik.handleSubmit}>
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
            isInvalid={authFailed}
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
            isInvalid={authFailed}
          />
          {authFailed
            && <Form.Control.Feedback type="invalid">{t('errors.authFailed')}</Form.Control.Feedback>}
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
