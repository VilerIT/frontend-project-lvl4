// @ts-check

import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import resources from './locales/index.js';
import store from './store.js';
import App from './components/App.jsx';

export default () => {
  const i18nInstance = i18n.createInstance();

  const lng = localStorage.getItem('lang') || 'ru';

  i18nInstance
    .use(initReactI18next)
    .init({
      lng,
      resources,
    });

  const socket = io();

  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};
