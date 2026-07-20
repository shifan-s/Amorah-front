import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addBackendCartItem as addBackendCartItemRequest,
  clearBackendCart as clearBackendCartRequest,
  getBackendCart,
  mergeGuestCart as mergeGuestCartRequest,
  removeBackendCartItem as removeBackendCartItemRequest,
  updateBackendCartItem as updateBackendCartItemRequest,
} from '../../services/cartService.js';
import {
  getColourVariant,
  getFirstAvailableColourVariant,
  getPrimaryVariantImage,
  getProductSizes,
  getVariant,
} from '../../utils/productVariants.js';

const guestSummary = {
  itemCount: 0,
  uniqueItemCount: 0,
  subtotal: 0,
  shippingCharge: 0,
  tax: 0,
  total: 0,
  freeShippingThreshold: 1499,
  amountRemainingForFreeShipping: 1499,
};

const initialState = {
  mode: 'guest',
  items: [],
  summary: guestSummary,
  loading: false,
  error: null,
  initialized: false,
  updatingItemId: null,
  warnings: [],
};

function createCartItemId(productId, variantId, selectedSize) {
  return [productId, variantId || 'default', selectedSize].join('-');
}

function createCartItem(product, selectedSize, selectedColour, quantity, selectedVariant) {
  const maxStock = selectedVariant?.stock || 1;
  const colourVariant = getColourVariant(product, selectedColour);
  const selectedVariantPrimaryImage = selectedVariant?.images?.find((image) => image.isPrimary) || selectedVariant?.images?.[0];
  const colourPrimaryImage = colourVariant?.images?.find((image) => image.isPrimary) || colourVariant?.images?.[0];
  const primaryImage = selectedVariantPrimaryImage?.url || colourPrimaryImage?.url || getPrimaryVariantImage(product, selectedColour).url;
  const itemKey = createCartItemId(product.id, selectedVariant?.id || selectedColour, selectedSize);
  const unitPrice = product.currentPrice ?? product.salePrice ?? product.regularPrice;

  return {
    id: itemKey,
    itemKey,
    productId: product.id,
    variantId: selectedVariant?.id || null,
    sizeId: selectedVariant?.sizeId || null,
    sku: selectedVariant?.sku || null,
    name: product.name,
    slug: product.slug,
    image: primaryImage,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,
    currentPrice: unitPrice,
    unitPrice,
    selectedSize,
    selectedColour,
    size: selectedSize,
    colourName: selectedVariant?.colourName || selectedColour,
    colourHex: selectedVariant?.colourHex || colourVariant?.colourHex || null,
    maxStock,
    availableStock: maxStock,
    quantity: Math.min(quantity, maxStock),
    available: true,
  };
}

function toGuestMergePayload(items = []) {
  return items
    .filter((item) => item.productId && item.variantId && item.sizeId && item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      sizeId: item.sizeId,
      quantity: item.quantity,
    }));
}

function applyBackendCart(state, cart) {
  state.mode = 'authenticated';
  state.items = cart.items || [];
  state.summary = cart.summary || guestSummary;
  state.initialized = true;
  state.error = null;
}

function applyPending(state) {
  state.loading = true;
  state.error = null;
}

function applyRejected(state, action) {
  state.loading = false;
  state.updatingItemId = null;
  state.error = action.payload?.message || action.error?.message || 'Unable to update cart';
}

export const fetchBackendCart = createAsyncThunk('cart/fetchBackendCart', async (_, { rejectWithValue }) => {
  try {
    return await getBackendCart();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const addBackendCartItem = createAsyncThunk('cart/addBackendCartItem', async (payload, { rejectWithValue }) => {
  try {
    return await addBackendCartItemRequest(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateBackendCartItem = createAsyncThunk('cart/updateBackendCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    return await updateBackendCartItemRequest(itemId, quantity);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const removeBackendCartItem = createAsyncThunk('cart/removeBackendCartItem', async (itemId, { rejectWithValue }) => {
  try {
    return await removeBackendCartItemRequest(itemId);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const clearBackendCart = createAsyncThunk('cart/clearBackendCart', async (_, { rejectWithValue }) => {
  try {
    return await clearBackendCartRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const mergeGuestCart = createAsyncThunk('cart/mergeGuestCart', async (_, { getState, rejectWithValue }) => {
  try {
    const items = toGuestMergePayload(getState().cart.items);
    if (!items.length) {
      return { cart: await getBackendCart(), warnings: [] };
    }

    return await mergeGuestCartRequest(items);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer(state, action) {
        state.mode = 'guest';
        const item = action.payload;
        const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
          const maxStock = item.availableStock || item.maxStock || existingItem.availableStock || existingItem.maxStock || 99;
          existingItem.maxStock = maxStock;
          existingItem.availableStock = maxStock;
          existingItem.unitPrice = item.unitPrice;
          existingItem.currentPrice = item.currentPrice;
          existingItem.quantity = Math.min(maxStock, existingItem.quantity + item.quantity);
        } else {
          state.items.push(item);
        }

        state.initialized = true;
      },
      prepare({ product, selectedSize, selectedColour, quantity = 1, variantId }) {
        const safeQuantity = Math.max(1, Math.floor(quantity));
        const firstVariant = getFirstAvailableColourVariant(product);
        const fallbackColour = selectedColour || firstVariant?.colourName || 'Default';
        const fallbackSize = selectedSize || getProductSizes(product)[0] || 'One Size';
        const selectedVariant =
          getVariant(product, fallbackSize, fallbackColour) ||
          (variantId ? getVariant(product, fallbackSize, firstVariant?.colourName) : null);

        return {
          payload: createCartItem(product, fallbackSize, fallbackColour, safeQuantity, selectedVariant),
        };
      },
    },
    updateCartItemQuantity(state, action) {
      const { itemId, quantity, maxStock } = action.payload;
      const item = state.items.find((cartItem) => cartItem.id === itemId);

      if (!item) {
        return;
      }

      const quantityLimit = maxStock || item.availableStock || item.maxStock || 99;
      const safeQuantity = Math.min(quantityLimit, Math.max(0, Math.floor(quantity)));

      if (safeQuantity === 0) {
        state.items = state.items.filter((cartItem) => cartItem.id !== itemId);
      } else {
        item.quantity = safeQuantity;
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.summary = guestSummary;
    },
    switchToGuestCart(state, action) {
      state.mode = 'guest';
      state.items = action.payload?.items || [];
      state.summary = guestSummary;
      state.loading = false;
      state.error = null;
      state.initialized = true;
      state.updatingItemId = null;
      state.warnings = [];
    },
    clearAuthenticatedCartState(state) {
      state.mode = 'guest';
      state.items = [];
      state.summary = guestSummary;
      state.loading = false;
      state.error = null;
      state.initialized = true;
      state.updatingItemId = null;
      state.warnings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBackendCart.pending, applyPending)
      .addCase(fetchBackendCart.fulfilled, (state, action) => {
        state.loading = false;
        applyBackendCart(state, action.payload);
      })
      .addCase(fetchBackendCart.rejected, applyRejected)
      .addCase(addBackendCartItem.pending, applyPending)
      .addCase(addBackendCartItem.fulfilled, (state, action) => {
        state.loading = false;
        applyBackendCart(state, action.payload);
      })
      .addCase(addBackendCartItem.rejected, applyRejected)
      .addCase(updateBackendCartItem.pending, (state, action) => {
        state.updatingItemId = action.meta.arg.itemId;
        state.error = null;
      })
      .addCase(updateBackendCartItem.fulfilled, (state, action) => {
        state.updatingItemId = null;
        applyBackendCart(state, action.payload);
      })
      .addCase(updateBackendCartItem.rejected, applyRejected)
      .addCase(removeBackendCartItem.pending, (state, action) => {
        state.updatingItemId = action.meta.arg;
        state.error = null;
      })
      .addCase(removeBackendCartItem.fulfilled, (state, action) => {
        state.updatingItemId = null;
        applyBackendCart(state, action.payload);
      })
      .addCase(removeBackendCartItem.rejected, applyRejected)
      .addCase(clearBackendCart.pending, applyPending)
      .addCase(clearBackendCart.fulfilled, (state, action) => {
        state.loading = false;
        applyBackendCart(state, action.payload);
      })
      .addCase(clearBackendCart.rejected, applyRejected)
      .addCase(mergeGuestCart.pending, applyPending)
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        applyBackendCart(state, action.payload.cart);
        state.warnings = action.payload.warnings || [];
      })
      .addCase(mergeGuestCart.rejected, applyRejected);
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  switchToGuestCart,
  clearAuthenticatedCartState,
} = cartSlice.actions;

export const selectCartMode = (state) => state.cart.mode;
export const selectCartItems = (state) => state.cart.items;
export const selectCartSummary = (state) => state.cart.summary;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartUpdatingItemId = (state) => state.cart.updatingItemId;
export const selectCartWarnings = (state) => state.cart.warnings;
export const selectCartItemCount = (state) =>
  state.cart.mode === 'authenticated'
    ? state.cart.summary?.itemCount || 0
    : state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.mode === 'authenticated'
    ? state.cart.summary?.subtotal || 0
    : state.cart.items.reduce((total, item) => total + (item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice) * item.quantity, 0);
export const selectCartDiscount = (state) =>
  state.cart.items.reduce(
    (total, item) => total + Math.max(0, item.regularPrice - (item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice)) * item.quantity,
    0,
  );
export const selectCartTotal = (state) =>
  state.cart.mode === 'authenticated'
    ? state.cart.summary?.total || 0
    : state.cart.items.reduce((total, item) => total + (item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice) * item.quantity, 0);

export default cartSlice.reducer;
