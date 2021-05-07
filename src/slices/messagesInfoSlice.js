import { createSlice } from '@reduxjs/toolkit';

import { setInitialState } from './channelsInfoSlice.js';

export const messagesInfoSlice = createSlice({
  name: 'messagesInfo',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, { payload: { messages } }) => ({
      messages: [...messages],
    }));
  },
});

export const { addMessage } = messagesInfoSlice.actions;

export default messagesInfoSlice.reducer;
