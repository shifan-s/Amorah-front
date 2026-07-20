import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productIds: [],
  items: [],
};

function toWishlistItem(payload) {
  if (typeof payload === 'string') {
    return { productId: payload };
  }

  return {
    productId: payload.id || payload.productId,
    slug: payload.slug,
    name: payload.name,
    image: payload.primaryImage?.url || payload.image,
    currentPrice: payload.currentPrice ?? payload.salePrice ?? payload.regularPrice,
  };
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const item = toWishlistItem(action.payload);
      const productId = item.productId;

      if (!state.productIds.includes(productId)) {
        state.productIds.push(productId);
        state.items.push(item);
      }
    },
    toggleWishlist(state, action) {
      const item = toWishlistItem(action.payload);
      const productId = item.productId;
      const exists = state.productIds.includes(productId);

      if (exists) {
        state.productIds = state.productIds.filter((id) => id !== productId);
        state.items = state.items.filter((wishlistItem) => wishlistItem.productId !== productId);
      } else {
        state.productIds.push(productId);
        state.items.push(item);
      }
    },
    removeFromWishlist(state, action) {
      const productId = typeof action.payload === 'string' ? action.payload : action.payload.productId;
      state.productIds = state.productIds.filter((id) => id !== productId);
      state.items = state.items.filter((item) => item.productId !== productId);
    },
    clearWishlist(state) {
      state.productIds = [];
      state.items = [];
    },
  },
});

export const { addToWishlist, toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistProductIds = (state) => state.wishlist.productIds;
export const selectWishlistItems = (state) => state.wishlist.items || [];
export const selectWishlistCount = (state) => state.wishlist.productIds.length;
export const selectIsProductWishlisted = (productId) => (state) =>
  state.wishlist.productIds.includes(productId);

export default wishlistSlice.reducer;
