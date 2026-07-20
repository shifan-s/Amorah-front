import { configureStore } from '@reduxjs/toolkit';
import {
  loadCartState,
  loadAuthState,
  loadRecentlyViewedState,
  loadWishlistState,
  saveCartState,
  saveAuthState,
  saveRecentlyViewedState,
  saveWishlistState,
} from '../utils/storage.js';
import appReducer from './slices/appSlice.js';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import categoryReducer from './slices/categorySlice.js';
import checkoutReducer from './slices/checkoutSlice.js';
import productReducer from './slices/productSlice.js';
import recentlyViewedReducer from './slices/recentlyViewedSlice.js';
import uiReducer from './slices/uiSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';

function getValidatedPreloadedState() {
  const cart = loadCartState();
  const auth = loadAuthState();
  const wishlist = loadWishlistState();
  const recentlyViewed = loadRecentlyViewedState();

  return {
    cart,
    auth,
    wishlist,
    recentlyViewed,
  };
}

export const store = configureStore({
  reducer: {
    app: appReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    checkout: checkoutReducer,
    recentlyViewed: recentlyViewedReducer,
    ui: uiReducer,
  },
  preloadedState: getValidatedPreloadedState(),
  devTools: true,
});

store.subscribe(() => {
  const state = store.getState();
  saveCartState(state.cart);
  saveAuthState(state.auth);
  saveWishlistState(state.wishlist);
  saveRecentlyViewedState(state.recentlyViewed);
});

export default store;
