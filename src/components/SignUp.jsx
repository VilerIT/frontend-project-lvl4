import React, { useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';

import useAuth from '../hooks/index.js';
import FormContainer from './FormContainer.jsx';

const signUpSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'errors.notInRange')
    .max(20, 'errors.notInRange'),
  password: yup.string()
    .min(6, 'errors.passwordTooShort'),
  confirmPassword: yup.string()
    .oneOf([
      yup.ref('password'),
    ], 'errors.passwordsDontMatch'),
});

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: () => {},
  });

  const auth = useAuth();
  const { t } = useTranslation();
  const usernameRef = useRef();
  const history = useHistory();

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
            isInvalid={formik.errors.username}
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
            isInvalid={formik.errors.password}
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
            isInvalid={formik.errors.confirmPassword}
          />
          {formik.errors.confirmPassword
            && <Form.Control.Feedback type="invalid">{t(formik.errors.confirmPassword)}</Form.Control.Feedback>}
        </Form.Group>
        <Button type="submit" className="w-100" variant="outline-primary">{t('buttons.signUp')}</Button>
      </Form>
    </FormContainer>
  );
};

export default SignUp;
