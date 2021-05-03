// @ts-check

import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import resources from './locales/index.js';
import AppNavbar from './components/AppNavbar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import NotFound from './components/NotFound.jsx';

export default () => {
  const i18nInstance = i18n.createInstance();

  i18nInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      resources,
    });

  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <AppNavbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
