import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import authContext from '../contexts/index.js';
import useAuth from '../hooks/index.js';
import AppNavbar from './AppNavbar.jsx';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import NotFound from './NotFound.jsx';
import getModal from './modals/index.js';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsInfoSlice.js';
import { addMessage } from '../slices/messagesInfoSlice.js';
import { closeModal } from '../slices/modalSlice.js';

const renderModal = (type, socket, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} socket={socket} />;
};

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  const [loggedIn, setLoggedIn] = useState(userId && userId.token);

  const logIn = (authData) => {
    localStorage.setItem('userId', JSON.stringify(authData));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path, exact }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      exact={exact}
      render={() => (auth.loggedIn
        ? children
        : <Redirect to="/login" />)}
    />
  );
};

const App = ({ socket }) => {
  const { type } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const onModalExited = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addMessage({ message }));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel({ channel }));
    });

    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel({ id }));
    });

    socket.on('renameChannel', ({ id, name }) => {
      dispatch(renameChannel({ id, name }));
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <AppNavbar />
          <Switch>
            <PrivateRoute exact path="/">
              <Chat socket={socket} />
            </PrivateRoute>
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
        {renderModal(type, socket, onModalExited)}
      </Router>
    </AuthProvider>
  );
};

export default App;
