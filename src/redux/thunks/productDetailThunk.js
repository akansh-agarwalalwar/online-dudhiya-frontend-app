import { createAsyncThunk } from '@reduxjs/toolkit';
import medicineService from '../../services/MedicineService';

/**
 * Fetch product details by ID or slug
 */
export const fetchProductDetails = createAsyncThunk(
  'productDetail/fetchProductDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await medicineService.getProductById(productId);
      
      if (response.success && response.data) {
              console.log('Product not found for ID:', response);

        return response.data.medicine;
      }
      
      return rejectWithValue('Product not found');
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to fetch product details'
      );
    }
  }
);

/**
 * Fetch related products
 */
export const fetchRelatedProducts = createAsyncThunk(
  'productDetail/fetchRelatedProducts',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await medicineService.getRelatedProducts(productId, 10);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to fetch related products:', error);
      return [];
    }
  }
);
