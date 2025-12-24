import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoryById,
  searchCategories,
  refreshCategories,
} from "../thunks/categoryThunk";

const initialState = {
  // Categories data
  categories: [],
  totalCount: 0,
  
  // Current category (when viewing details)
  currentCategory: null,
  
  // Search related
  searchResults: [],
  searchTerm: "",
  
  // Loading states
  loading: false,
  refreshing: false,
  searchLoading: false,
  categoryLoading: false,
  
  // Error states
  error: null,
  searchError: null,
  categoryError: null,
  
  // Meta information
  lastFetchTime: null,
  lastRefreshTime: null,
  
  // Cache control
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.categoryError = null;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTerm = "";
      state.searchError = null;
    },
    
    // Clear current category
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
      state.categoryError = null;
    },
    
    // Set loading state manually
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Update cache expiry time
    setCacheExpiry: (state, action) => {
      state.cacheExpiry = action.payload;
    },
    
    // Reset entire state
    resetCategoryState: () => initialState,
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || [];
        state.totalCount = action.payload.total || 0;
        state.lastFetchTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
        state.categories = [];
        state.totalCount = 0;
      })

      // Fetch Category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.currentCategory = action.payload.category || action.payload;
        state.categoryError = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload?.message || "Failed to fetch category";
        state.currentCategory = null;
      })

      // Search Categories
      .addCase(searchCategories.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.categories || [];
        state.searchTerm = action.payload.searchTerm || "";
        state.searchError = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload?.message || "Failed to search categories";
        state.searchResults = [];
      })

      // Refresh Categories
      .addCase(refreshCategories.pending, (state) => {
        state.refreshing = true;
        // Don't clear existing data while refreshing for better UX
      })
      .addCase(refreshCategories.fulfilled, (state, action) => {
        state.refreshing = false;
        state.categories = action.payload.categories || [];
        state.totalCount = action.payload.total || 0;
        state.lastRefreshTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshCategories.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload?.message || "Failed to refresh categories";
      });
  },
});

// Action creators
export const {
  clearErrors,
  clearSearchResults,
  clearCurrentCategory,
  setLoading,
  setCacheExpiry,
  resetCategoryState,
} = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesTotal = (state) => state.categories.totalCount;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectSearchResults = (state) => state.categories.searchResults;
export const selectSearchLoading = (state) => state.categories.searchLoading;
export const selectIsRefreshing = (state) => state.categories.refreshing;

// Memoized selectors for better performance
export const selectActiveCategoriesOnly = (state) => 
  state.categories.categories.filter(category => category.isActive);

export const selectCategoriesWithSubcategories = (state) =>
  state.categories.categories.filter(category => 
    category.subcategories && category.subcategories.length > 0
  );

// Check if data is fresh (not expired)
export const selectIsCategoriesDataFresh = (state) => {
  const { lastFetchTime, cacheExpiry } = state.categories;
  if (!lastFetchTime) return false;
  
  const now = new Date().getTime();
  const fetchTime = new Date(lastFetchTime).getTime();
  return (now - fetchTime) < cacheExpiry;
};

export default categorySlice.reducer;