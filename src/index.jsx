// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import '../assets/application.scss';
import App from './components/App.jsx';
import resources from './locales/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const i18nInstance = i18n.createInstance();

i18nInstance
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources,
  });

const mountNode = document.getElementById('chat');

ReactDOM.render(<App />, mountNode);
