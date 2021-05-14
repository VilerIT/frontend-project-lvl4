import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import _ from 'lodash';
import {
  act, render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http.js';
import nock from 'nock';
import MockedSocket from 'socket.io-mock';
import '@testing-library/jest-dom/extend-expect.js';

import init from '../src/init.jsx';
import routes from '../src/routes.js';

axios.defaults.adapter = httpAdapter;

const token = 'random-token';
const data = {
  channels: [
    { id: 1, name: 'channel1', removable: false },
    { id: 2, name: 'channel2', removable: false },
  ],
  currentChannelId: 1,
  messages: [
    {
      id: 3, channelId: 1, body: 'channel1 message', username: 'user',
    },
    {
      id: 4, channelId: 2, body: 'channel2 message', username: 'user',
    },
  ],
};

const getDataScope = () => (
  nock('http://localhost', { reqheaders: { Authorization: `Bearer ${token}` } })
    .get(routes.data())
    .reply(200, data)
);

let socket;

beforeEach(async () => {
  nock('http://localhost')
    .post(routes.login(), { username: 'user', password: 'pass' })
    .reply(200, { token, username: 'random' });

  socket = new MockedSocket();

  const vdom = await init(socket.socketClient);

  render(vdom);

  await act(async () => {
    userEvent.type(await screen.findByLabelText(/Your nickname/i), 'user');
    userEvent.type(await screen.findByLabelText(/Password/i), 'pass');

    userEvent.click(await screen.findByRole('button', { name: 'Log in' }));
  });
});

describe('Channels', () => {
  test('Must show channels properly', async () => {
    const scope = getDataScope();

    await waitFor(() => expect(scope.isDone()).toBe(true));

    expect(await screen.findByRole('button', { name: 'channel1' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'channel2' })).toBeInTheDocument();
  });

  test('Add/Rename/Remove channels', async () => {
    getDataScope();
    let newChannelId;

    socket.on('newChannel', (channel, ack) => {
      expect(channel.name).toBe('new-channel');

      newChannelId = _.uniqueId();

      socket.emit('newChannel', {
        ...channel,
        removable: true,
        id: newChannelId,
      });

      ack({ status: 'ok' });
    });

    socket.on('renameChannel', (channel, ack) => {
      expect(channel.id).toBe(newChannelId);
      expect(channel.name).toBe('renamed!');

      socket.emit('renameChannel', { ...channel });

      ack({ status: 'ok' });
    });

    socket.on('removeChannel', (channel, ack) => {
      expect(channel.id).toBe(newChannelId);

      socket.emit('removeChannel', { ...channel });

      ack({ status: 'ok' });
    });

    expect(await screen.findByRole('button', { name: '+' })).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: '+' }));
    });

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    await act(async () => {
      userEvent.type(await screen.findByTestId('add-channel'), 'new-channel');
      userEvent.click(await screen.findByRole('button', { name: 'Add' }));
    });

    await waitFor(() => expect(modal).not.toBeInTheDocument());

    expect(await screen.findByRole('button', { name: 'new-channel' })).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByTestId('channel-dropdown'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('channel-dropdown-menu'))
        .not
        .toHaveStyle('pointer-events: none;');
    });

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: 'Rename' }));
      userEvent.type(await screen.findByDisplayValue('new-channel'), 'renamed!');
      userEvent.click(await screen.findByTestId('rename-button'));
    });

    const renamedChannel = await screen.findByRole('button', { name: 'renamed!' });

    expect(renamedChannel).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByTestId('channel-dropdown'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('channel-dropdown-menu'))
        .not
        .toHaveStyle('pointer-events: none;');
    });

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: 'Remove' }));
      userEvent.click(await screen.findByTestId('remove-button'));
    });

    expect(renamedChannel).not.toBeInTheDocument();
  });
});

describe('Messages', () => {
  test('Must show messages properly', async () => {
    const scope = getDataScope();

    await waitFor(() => expect(scope.isDone()).toBe(true));

    const firstMessage = await screen.findByText(/channel1 message/i);
    expect(firstMessage).toBeInTheDocument();

    await act(async () => {
      userEvent.click(await screen.findByRole('button', { name: 'channel2' }));
    });

    expect(firstMessage).not.toBeInTheDocument();
    expect(await screen.findByText(/channel2 message/i)).toBeInTheDocument();
  });

  test('Add messages', async () => {
    getDataScope();

    socket.on('newMessage', (message, ack) => {
      socket.emit('newMessage', { ...message, id: _.uniqueId() });
      ack({ status: 'ok' });
    });

    await act(async () => {
      userEvent.type(await screen.findByTestId('new-message'), 'Hello.');
      userEvent.click(await screen.findByRole('button', { name: 'Send' }));
    });

    expect(await screen.findByText('Hello.')).toBeInTheDocument();
  });
});
