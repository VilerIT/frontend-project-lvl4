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
  },
});

export const { setInitialState } = channelsInfoSlice.actions;

export default channelsInfoSlice.reducer;
