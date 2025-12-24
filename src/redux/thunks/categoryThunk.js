import { createAsyncThunk } from "@reduxjs/toolkit";
import CategoryService from "../../services/CategoryService";

/**
 * Async thunk to fetch all categories
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategories(params);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch categories",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Async thunk to fetch category by ID or slug
 */
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoryById(idOrSlug);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to fetch category",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Async thunk to search categories
 */
export const searchCategories = createAsyncThunk(
  "categories/searchCategories",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await CategoryService.searchCategories(searchTerm);
      return {
        ...response.data,
        searchTerm,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to search categories",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Async thunk to refresh categories (force fetch)
 */
export const refreshCategories = createAsyncThunk(
  "categories/refreshCategories",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Invalidate cache and fetch fresh data
      const result = await dispatch(fetchCategories({ _refresh: Date.now() }));
      if (fetchCategories.rejected.match(result)) {
        throw new Error(result.payload.message);
      }
      return result.payload;
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to refresh categories",
        timestamp: new Date().toISOString(),
      });
    }
  }
);