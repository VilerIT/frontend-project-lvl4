import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  isOpen: false,
  type: null,
  extra: null,
});

export const modalSlice = createSlice({
  name: 'modal',
  initialState: getInitialState(),
  reducers: {
    openModal: (state, { payload: { type, extra = null } }) => ({
      isOpen: true,
      type,
      extra,
    }),
    closeModal: () => getInitialState(),
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
