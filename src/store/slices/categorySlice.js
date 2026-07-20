import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getCategories } from '../../services/categoryService.js';
import { attachSubcategories } from '../../utils/categoryNormalizer.js';

export const fetchPublicCategories = createAsyncThunk('categories/fetchPublicCategories', async () => {
  return getCategories();
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to load categories.';
      });
  },
});

export const selectPublicCategories = (state) => state.categories.categories;
export const selectMainCategories = createSelector([selectPublicCategories], (categories) =>
  categories.filter((category) => category.level === 0),
);
export const selectNavigationCategories = createSelector([selectPublicCategories], (categories) =>
  attachSubcategories(categories.filter((category) => category.showInNavigation)),
);
export const selectHomepageCategories = createSelector([selectPublicCategories], (categories) =>
  categories.filter((category) => category.level === 0 && category.showOnHomepage),
);
export const selectCategoryStatus = (state) => state.categories.status;

export default categorySlice.reducer;
