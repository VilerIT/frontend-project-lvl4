// @ts-check

import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './locales/index.js';
import App from './components/App.jsx';

export default () => {
  const i18nInstance = i18n.createInstance();

  i18nInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      resources,
    });

  return <App />;
};
