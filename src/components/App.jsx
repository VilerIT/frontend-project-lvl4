import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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

const renderModal = (type, onExited) => {
  if (!type) {
    return null;
  }

  const Modal = getModal(type);

  return <Modal onExited={onExited} />;
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
              <Route exact path="/" component={Chat} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
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
