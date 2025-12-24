import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Medicine/Product API Service
 * Handles all product-related API calls
 */
export const medicineService = {
  /**
   * Get product details by ID or slug
   * @param {string} id - Product ID or slug
   * @returns {Promise} Product details
   */
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/api/v1/medicine/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  /**
   * Get all products with filters
   * @param {object} params - Query parameters (offset, limit, search_term, etc.)
   * @returns {Promise} List of products
   */
  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get('/api/v1/medicine', params);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Search products by term
   * @param {string} searchTerm - Search query
   * @param {object} filters - Additional filters
   * @returns {Promise} Search results
   */
  async searchProducts(searchTerm, filters = {}) {
    try {
      const params = {
        search_term: searchTerm,
        ...filters,
      };
      const response = await apiClient.get('/api/v1/medicine', params);
      return response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  /**
   * Get related products
   * @param {string} productId - Product ID
   * @param {number} limit - Number of related products to fetch
   * @returns {Promise} Related products
   */
  async getRelatedProducts(productId, limit = 10) {
    try {
      // This endpoint might need to be created on backend
      const response = await apiClient.get(`/api/v1/medicine/${productId}/related`, {
        limit,
      });
      return response;
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Return empty array if endpoint doesn't exist yet
      return { success: true, data: [], message: 'No related products' };
    }
  },
};

export default medicineService;
