import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useAuth from '../hooks/index.js';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('buttons.logOut')}</Button>
      : <Button as={Link} to="/login">{t('buttons.logIn')}</Button>
  );
};

const AppNavbar = () => (
  <Navbar bg="light" expand="lg">
    <Link to="/" className="mr-auto navbar-brand">VilerChat</Link>
    <Nav>
      <AuthButton />
    </Nav>
  </Navbar>
);

export default AppNavbar;
