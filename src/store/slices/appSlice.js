import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brandName: 'AMORAH',
  brandByline: 'By N-ZAN Designs',
  currency: 'INR',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});

export default appSlice.reducer;
