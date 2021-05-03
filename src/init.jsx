// @ts-check

import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './components/App.jsx';
import resources from './locales/index.js';

export default () => {
  const i18nInstance = i18n.createInstance();

  i18nInstance
    .use(initReactI18next)
    .init({
      lng: 'en',
      resources,
    });

  return <App />;
};
