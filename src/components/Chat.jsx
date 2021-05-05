import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';
import { setInitialState } from '../slices/channelsInfoSlice.js';

const getAuthorizationHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Home = () => {
  const channels = useSelector((state) => state.channelsInfo.channels);
  const dispatch = useDispatch();

  useEffect(async () => {
    const url = routes.data();

    const res = await axios.get(url, { headers: getAuthorizationHeader() });

    dispatch(setInitialState(res.data));
  }, []);

  console.log(channels);

  return (
    <Card className="text-center">
      <Card.Body>
        <Card.Title>VilerChat</Card.Title>
        <Card.Text>Coming up soon...</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Home;
