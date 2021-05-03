import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: () => {},
  });

  const { t } = useTranslation();

  return (
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
  );
};

const Login = () => (
  <Container fluid>
    <Row className="justify-content-center pt-5">
      <Col sm={4}>
        <LoginForm />
      </Col>
    </Row>
  </Container>
);

export default Login;
