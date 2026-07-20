import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingAddress: null,
  billingAddress: null,
  notes: '',
  status: 'idle',
  error: null,
  lastOrder: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setBillingAddress(state, action) {
      state.billingAddress = action.payload;
    },
    setCheckoutNotes(state, action) {
      state.notes = action.payload;
    },
    setCheckoutStatus(state, action) {
      state.status = action.payload;
    },
    setCheckoutError(state, action) {
      state.error = action.payload;
    },
    setLastOrder(state, action) {
      state.lastOrder = action.payload;
    },
    resetCheckout() {
      return initialState;
    },
  },
});

export const {
  setShippingAddress,
  setBillingAddress,
  setCheckoutNotes,
  setCheckoutStatus,
  setCheckoutError,
  setLastOrder,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckout = (state) => state.checkout;

export default checkoutSlice.reducer;
