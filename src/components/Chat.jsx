/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';
import { setInitialState } from '../slices/channelsInfoSlice.js';
import { useAuth, useSocket } from '../hooks/index.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getToken = () => localStorage.getItem('token');

const getAuthorizationHeader = () => {
  const token = getToken();

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
};

const Chat = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const socket = useSocket();

  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let mounted = true;

    const fetchData = async () => {
      const url = routes.data();
      try {
        const res = await axios.get(url, { headers: getAuthorizationHeader() });

        dispatch(setInitialState(res.data));

        socket.auth = { token: getToken() };

        if (mounted) {
          setContentLoaded(true);
        }
      } catch (e) {
        if (e.isAxiosError) {
          auth.logOut();
          return;
        }

        throw e;
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return contentLoaded ? (
    <Row className="flex-grow-1 h-75 pb-3">
      <Channels />
      <Messages />
    </Row>
  ) : <Spinner animation="grow" variant="primary" />;
};

export default Chat;
