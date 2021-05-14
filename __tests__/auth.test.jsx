import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';
import nock from 'nock';
import '@testing-library/jest-dom/extend-expect.js';

import init from '../src/init.jsx';
import routes from '../src/routes.js';

axios.defaults.adapter = httpAdapter;

const token = 'random-token';
const getDataScope = () => (
  nock('http://localhost', { reqheaders: { Authorization: `Bearer ${token}` } })
    .get(routes.data())
    .reply(200, { channels: [], currentChannelId: null, messages: [] })
);

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(async () => {
  const vdom = await init();

  render(vdom);
});

afterAll(() => {
  nock.enableNetConnect();
});

describe('Login', () => {
  test('Login form must be shown', async () => {
    expect(window.location.pathname).toBe('/login');

    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  test('Must log in and log out successfully', async () => {
    const scope = nock('http://localhost')
      .post(routes.login(), { username: 'random', password: 'rand' })
      .reply(200, { token, username: 'random' });

    const dataScope = getDataScope();

    await act(async () => {
      userEvent.type(await screen.findByLabelText(/Your nickname/i), 'random');
      userEvent.type(await screen.findByLabelText(/Password/i), 'rand');

      userEvent.click(await screen.findByRole('button', { name: 'Log in' }));
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(dataScope.isDone()).toBe(true);
      expect(window.location.pathname).toBe('/');
    });

    const logOutButton = await screen.findByText(/Log out/i);

    expect(logOutButton).toBeInTheDocument();

    act(() => {
      userEvent.click(logOutButton);
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('Error message must be shown', async () => {
    nock('http://localhost')
      .post(routes.login(), { username: 'incorrect', password: 'incorrect' })
      .reply(401, { statusCode: 401 });

    await act(async () => {
      userEvent.type(await screen.findByLabelText(/Your nickname/i), 'incorrect');
      userEvent.type(await screen.findByLabelText(/Password/i), 'incorrect');

      userEvent.click(await screen.findByRole('button', { name: 'Log in' }));
    });

    expect(await screen.findByText(/Incorrect username or password/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Your nickname/i)).toHaveClass('is-invalid');
    expect(await screen.findByLabelText(/Password/i)).toHaveClass('is-invalid');
  });
});

describe('Sign up', () => {
  test('Must sign up successfully', async () => {
    const scope = nock('http://localhost')
      .post(routes.signup(), { username: 'user', password: 'qwerty' })
      .reply(201, { token, username: 'user' });

    const dataScope = getDataScope();

    userEvent.click(await screen.findByText(/Sign up/i));

    await waitFor(() => expect(window.location.pathname).toBe('/signup'));

    await act(async () => {
      userEvent.type(await screen.findByLabelText(/Username/i), 'user');
      userEvent.type(await screen.findByLabelText(/^Password$/i), 'qwerty');
      userEvent.type(await screen.findByLabelText(/Confirm password/i), 'qwerty');

      userEvent.click(await screen.findByRole('button', { name: 'Sign up' }));
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(dataScope.isDone()).toBe(true);
      expect(window.location.pathname).toBe('/');
    });
  });
});
