import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

const AppNavbar = ({ t }) => (
  <Navbar bg="light" expand="lg">
    <Link to="/" className="mr-auto navbar-brand">VilerChat</Link>
    <Nav>
      <Link to="/login" className="nav-link">{t('buttons.signIn')}</Link>
    </Nav>
  </Navbar>
);

export default withTranslation()(AppNavbar);
