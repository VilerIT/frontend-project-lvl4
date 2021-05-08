import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

export const channelsInfoSlice = createSlice({
  name: 'channelsInfo',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setInitialState: (state, { payload: { channels, currentChannelId } }) => ({
      channels: [...channels],
      currentChannelId,
    }),
    setCurrentChannelId: (state, { payload: { id } }) => {
      state.currentChannelId = id;
    },
    addChannel: (state, { payload: { channel } }) => {
      state.channels.push(channel);
    },
    removeChannel: (state, { payload: { id } }) => {
      state.channels = state.channels.filter((channel) => (channel.id !== id));

      if (state.currentChannelId === id) {
        state.currentChannelId = _.first(state.channels).id;
      }
    },
    renameChannel: (state, { payload: { id, name } }) => {
      const channel = state.channels.find((ch) => (ch.id === id));
      channel.name = name;
    },
  },
});

export const {
  setInitialState,
  setCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
