import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchCategoryById,
  searchCategories,
  refreshCategories,
} from '../redux/thunks/categoryThunk';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCurrentCategory,
  selectSearchResults,
  selectSearchLoading,
  selectIsRefreshing,
  selectIsCategoriesDataFresh,
  selectActiveCategoriesOnly,
  selectCategoriesWithSubcategories,
  clearErrors,
  clearSearchResults,
  clearCurrentCategory,
} from '../redux/slices/categorySlice';

/**
 * Custom hook for category management
 * Provides a clean interface for category operations
 */
export const useCategories = () => {
  const dispatch = useDispatch();

  // Selectors
  const categories = useSelector(selectCategories);
  const activeCategories = useSelector(selectActiveCategoriesOnly);
  const categoriesWithSub = useSelector(selectCategoriesWithSubcategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const currentCategory = useSelector(selectCurrentCategory);
  const searchResults = useSelector(selectSearchResults);
  const searchLoading = useSelector(selectSearchLoading);
  const refreshing = useSelector(selectIsRefreshing);
  const isDataFresh = useSelector(selectIsCategoriesDataFresh);

  // Actions
  const loadCategories = useCallback((params = {}) => {
    return dispatch(fetchCategories(params));
  }, [dispatch]);

  const loadCategoryById = useCallback((idOrSlug) => {
    return dispatch(fetchCategoryById(idOrSlug));
  }, [dispatch]);

  const searchCategoriesByTerm = useCallback((searchTerm) => {
    return dispatch(searchCategories(searchTerm));
  }, [dispatch]);

  const refreshCategoryList = useCallback(() => {
    return dispatch(refreshCategories());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentCategory());
  }, [dispatch]);

  // Derived data
  const getCategoryById = useCallback((id) => {
    return categories.find(cat => cat.id === id);
  }, [categories]);

  const getCategoryBySlug = useCallback((slug) => {
    return categories.find(cat => cat.slug === slug);
  }, [categories]);

  const getCategoriesWithProducts = useCallback(() => {
    return categories.filter(cat => cat.subCategoryCount > 0);
  }, [categories]);

  // Utility functions
  const shouldRefreshData = useCallback(() => {
    return !isDataFresh || categories.length === 0;
  }, [isDataFresh, categories.length]);

  const getErrorMessage = useCallback(() => {
    if (error) {
      if (typeof error === 'string') return error;
      return error.message || 'An error occurred';
    }
    return null;
  }, [error]);

  return {
    // Data
    categories,
    activeCategories,
    categoriesWithSub,
    currentCategory,
    searchResults,
    
    // States
    loading,
    error,
    searchLoading,
    refreshing,
    isDataFresh,
    
    // Actions
    loadCategories,
    loadCategoryById,
    searchCategoriesByTerm,
    refreshCategoryList,
    clearAllErrors,
    clearSearch,
    clearCurrent,
    
    // Utilities
    getCategoryById,
    getCategoryBySlug,
    getCategoriesWithProducts,
    shouldRefreshData,
    getErrorMessage,
  };
};

/**
 * Hook for category selection and navigation
 */
export const useCategorySelection = (onCategorySelect) => {
  const { getCategoryById, getCategoryBySlug } = useCategories();

  const handleCategorySelect = useCallback((category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  }, [onCategorySelect]);

  const selectCategoryById = useCallback((id) => {
    const category = getCategoryById(id);
    if (category) {
      handleCategorySelect(category);
    }
    return category;
  }, [getCategoryById, handleCategorySelect]);

  const selectCategoryBySlug = useCallback((slug) => {
    const category = getCategoryBySlug(slug);
    if (category) {
      handleCategorySelect(category);
    }
    return category;
  }, [getCategoryBySlug, handleCategorySelect]);

  return {
    handleCategorySelect,
    selectCategoryById,
    selectCategoryBySlug,
  };
};