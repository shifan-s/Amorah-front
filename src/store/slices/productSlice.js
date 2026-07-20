import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from '../../services/productService.js';

export const fetchPublicProducts = createAsyncThunk('products/fetchPublicProducts', async () => {
  const result = await getProducts({ limit: 100, sort: 'newest' });
  return result.products;
});

export const fetchPublicProductBySlug = createAsyncThunk('products/fetchPublicProductBySlug', async (slug) => {
  return getProductBySlug(slug);
});

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelatedProducts', async (slug) => {
  return {
    slug,
    products: await getRelatedProducts(slug, { limit: 8 }),
  };
});

const initialState = {
  products: [],
  relatedBySlug: {},
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    upsertProducts(state, action) {
      action.payload.forEach((product) => {
        const index = state.products.findIndex((item) => item.id === product.id);
        if (index >= 0) {
          state.products[index] = product;
        } else {
          state.products.push(product);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to load products.';
      })
      .addCase(fetchPublicProductBySlug.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchPublicProductBySlug.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index >= 0) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchPublicProductBySlug.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.error.message || 'Unable to load product.';
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedBySlug[action.payload.slug] = action.payload.products;
      });
  },
});

export const { upsertProducts } = productSlice.actions;

export const selectAllProducts = (state) => state.products.products;
export const selectFeaturedProducts = (state) => state.products.products.filter((product) => product.featured);
export const selectBestSellerProducts = (state) => state.products.products.filter((product) => product.bestSeller);
export const selectNewArrivalProducts = (state) => state.products.products.filter((product) => product.newArrival);
export const selectProductBySlug = (slug) => (state) =>
  state.products.products.find((product) => product.slug === slug);
export const selectProductStatus = (state) => state.products.status;
export const selectProductDetailStatus = (state) => state.products.detailStatus;
export const selectRelatedProductsBySlug = (slug) => (state) => state.products.relatedBySlug[slug] || [];

export default productSlice.reducer;
