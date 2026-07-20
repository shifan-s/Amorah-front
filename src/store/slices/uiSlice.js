import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drawers: {
    search: false,
    mobileMenu: false,
    cart: false,
  },
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDrawer(state, action) {
      state.drawers[action.payload] = true;
    },
    closeDrawer(state, action) {
      state.drawers[action.payload] = false;
    },
    closeAllDrawers(state) {
      Object.keys(state.drawers).forEach((drawer) => {
        state.drawers[drawer] = false;
      });
    },
    openModal(state, action) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { openDrawer, closeDrawer, closeAllDrawers, openModal, closeModal } = uiSlice.actions;
export const selectDrawerState = (drawer) => (state) => Boolean(state.ui.drawers[drawer]);
export const selectActiveModal = (state) => state.ui.activeModal;

export default uiSlice.reducer;
