import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';

import { useAuth } from '../hooks/index.js';
import FormContainer from './FormContainer.jsx';
import { signUpSchema } from '../validationSchemas.js';
import routes from '../routes.js';

const SignUp = () => {
  const [signUpFailed, setSignUpFailed] = useState(false);
  const auth = useAuth();
  const { t } = useTranslation();
  const usernameRef = useRef();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: () => {
      setSignUpFailed(false);

      return signUpSchema;
    },
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      setSubmitting(true);

      const url = routes.signup();

      try {
        const res = await axios.post(url, { username, password });

        auth.logIn(res.data);

        history.push('/');
      } catch (e) {
        /* if (e.isAxiosError && e.response.status === 409) {
          setSubmitting(false);
          setSignUpFailed(true);
          return;
        }

        throw e; */
        setSubmitting(false);
        setSignUpFailed(true);
      }
    },
  });

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  if (auth.loggedIn) {
    history.replace('/');
  }

  return (
    <FormContainer>
      <Form className="p-3" onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">{t('labels.username')}</Form.Label>
          <Form.Control
            name="username"
            id="username"
            autoComplete="username"
            required
            placeholder={t('placeholders.range')}
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={formik.errors.username || signUpFailed}
            readOnly={formik.isSubmitting}
            ref={usernameRef}
          />
          {formik.errors.username
            && <Form.Control.Feedback type="invalid">{t(formik.errors.username)}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">{t('labels.password')}</Form.Label>
          <Form.Control
            name="password"
            id="password"
            autoComplete="new-password"
            type="password"
            required
            placeholder={t('placeholders.noShorterThan')}
            onChange={formik.handleChange}
            value={formik.values.password}
            readOnly={formik.isSubmitting}
            isInvalid={formik.errors.password || signUpFailed}
          />
          {formik.errors.password
            && <Form.Control.Feedback type="invalid">{t(formik.errors.password)}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="confirmPassword">{t('labels.confirmPassword')}</Form.Label>
          <Form.Control
            name="confirmPassword"
            id="confirmPassword"
            autoComplete="new-password"
            type="password"
            required
            placeholder={t('placeholders.passwordsMustMatch')}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            readOnly={formik.isSubmitting}
            isInvalid={formik.errors.confirmPassword || signUpFailed}
          />
          {formik.errors.confirmPassword
            && <Form.Control.Feedback type="invalid">{t(formik.errors.confirmPassword)}</Form.Control.Feedback>}
          {signUpFailed
            && <Form.Control.Feedback type="invalid">{t('errors.userExists')}</Form.Control.Feedback>}
        </Form.Group>
        <Button
          type="submit"
          className="w-100"
          variant="outline-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            && <Spinner className="mr-2" animation="border" size="sm" />}
          {t('buttons.signUp')}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignUp;
