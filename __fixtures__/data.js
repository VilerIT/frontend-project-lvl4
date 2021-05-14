export default {
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
