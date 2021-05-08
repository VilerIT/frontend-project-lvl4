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
    },
  },
});

export const {
  setInitialState,
  setCurrentChannelId,
  addChannel,
  removeChannel,
} = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
