import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import FormContainer from './FormContainer.jsx';

const Login = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: () => {},
  });

  const { t } = useTranslation();

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
          />
        </Form.Group>
        <Button
          type="submit"
          variant="outline-primary"
          className="w-100 mb-3"
        >
          {t('buttons.signIn')}
        </Button>
        <div className="text-center">
          <span>
            Нет аккаунта?
            &nbsp;
            <Link to="/signup">Регистрация</Link>
          </span>
        </div>
      </Form>
    </FormContainer>
  );
};

export default Login;
