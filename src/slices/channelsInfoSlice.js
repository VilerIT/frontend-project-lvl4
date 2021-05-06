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
  },
});

export const { setInitialState, setCurrentChannelId } = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
