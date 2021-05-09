// @ts-check

import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';

import resources from './locales/index.js';
import store from './store.js';
import App from './components/App.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const i18nInstance = i18n.createInstance();

const lng = localStorage.getItem('lang') || 'ru';

i18nInstance
  .use(initReactI18next)
  .init({
    lng,
    resources,
  });

const socket = io();

const mountNode = document.querySelector('#chat');

ReactDOM.render((
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
), mountNode);
