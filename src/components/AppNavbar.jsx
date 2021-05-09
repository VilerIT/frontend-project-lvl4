import React from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { useAuth } from '../hooks/index.js';

const languages = ['en', 'ru'];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleSwitchLanguage = (lang) => () => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const renderLanguages = () => (
    <>
      {languages.map((lang) => (
        <NavDropdown.Item
          key={_.uniqueId()}
          onClick={handleSwitchLanguage(lang)}
        >
          {lang}
        </NavDropdown.Item>
      ))}
    </>
  );

  return (
    <NavDropdown title={i18n.language}>
      {renderLanguages()}
    </NavDropdown>
  );
};

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
  <Navbar className="mb-3" bg="light">
    <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
    <Nav className="mr-auto">
      <LanguageSwitcher />
    </Nav>
    <Nav>
      <AuthButton />
    </Nav>
  </Navbar>
);

export default AppNavbar;
