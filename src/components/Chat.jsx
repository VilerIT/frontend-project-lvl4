import React, { useState, useEffect } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';
import { setInitialState } from '../slices/channelsInfoSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getAuthorizationHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = () => {
  const dispatch = useDispatch();

  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(async () => {
    const url = routes.data();

    const res = await axios.get(url, { headers: getAuthorizationHeader() });

    dispatch(setInitialState(res.data));

    setContentLoaded(true);
  }, []);

  return contentLoaded ? (
    <Row className="flex-grow-1 h-75 pb-3">
      <Channels />
      <Messages />
    </Row>
  ) : <Spinner animation="grow" variant="primary" />;
};

export default Home;
