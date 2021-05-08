import { configureStore } from '@reduxjs/toolkit';

import channelsInfoReducer from './slices/channelsInfoSlice.js';
import messagesInfoReducer from './slices/messagesInfoSlice.js';
import modalReducer from './slices/modalSlice.js';

export default configureStore({
  reducer: {
    channelsInfo: channelsInfoReducer,
    messagesInfo: messagesInfoReducer,
    modal: modalReducer,
  },
});
