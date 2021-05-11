import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { authContext, socketContext } from '../contexts/index.js';
import AppNavbar from './AppNavbar.jsx';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import NotFound from './NotFound.jsx';
import getModal from './modals/index.js';
import { closeModal } from '../slices/modalSlice.js';
import { useAuth } from '../hooks/index.js';

const renderModal = (type, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} />;
};

const AuthProvider = ({ children }) => {
  const userToken = localStorage.getItem('token');

  const [loggedIn, setLoggedIn] = useState(!!userToken);

  const logIn = ({ token, username }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, exact, path }) => {
  const { loggedIn } = useAuth();

  return (
    <Route exact={exact} path={path}>
      {loggedIn ? children : <Redirect to="/login" />}
    </Route>
  );
};

const App = ({ socket }) => {
  const { type } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const onModalExited = () => {
    dispatch(closeModal());
  };

  return (
    <AuthProvider>
      <socketContext.Provider value={socket}>
        <Router>
          <div className="d-flex flex-column h-100">
            <AppNavbar />
            <Switch>
              <PrivateRoute exact path="/">
                <Chat />
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
          {renderModal(type, onModalExited)}
        </Router>
      </socketContext.Provider>
    </AuthProvider>
  );
};

export default App;
