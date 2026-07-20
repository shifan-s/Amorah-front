import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productIds: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addRecentlyViewedProduct(state, action) {
      const productId = action.payload;
      state.productIds = [productId, ...state.productIds.filter((id) => id !== productId)].slice(0, 12);
    },
    clearRecentlyViewed(state) {
      state.productIds = [];
    },
  },
});

export const { addRecentlyViewedProduct, clearRecentlyViewed } = recentlyViewedSlice.actions;
export const selectRecentlyViewedProductIds = (state) => state.recentlyViewed.productIds;

export default recentlyViewedSlice.reducer;
