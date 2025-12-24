import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Medicine/Product Search Service
 */
class SearchService {
    /**
     * Search medicines/products
     * @param {string} searchTerm - Search query
     * @param {object} filters - Additional filters (categoryIds, subCategoryIds, etc.)
     * @returns {Promise} - Search results
     */
    async searchMedicines(searchTerm, filters = {}) {
        try {
            const params = {
                search_term: searchTerm,
                limit: filters.limit || 20,
                offset: filters.offset || 0,
                ...filters,
            };

            // Remove empty/undefined params
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    delete params[key];
                }
            });

            const response = await apiClient.get(
                API_CONFIG.ENDPOINTS.MEDICINE.SEARCH,
                params
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Search medicines error:', error);
            return {
                success: false,
                error: error.message || 'Failed to search medicines',
                data: { medicines: [], total_count: 0 },
            };
        }
    }

    /**
     * Get popular medicines/products
     * @param {number} limit - Number of items to fetch
     * @returns {Promise} - List of popular items
     */
    async getPopularItems(limit = 10) {
        try {
            const response = await apiClient.get(
                API_CONFIG.ENDPOINTS.MEDICINE.GET_POPULAR_ITEMS,
                { limit }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Get popular items error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch popular items',
                data: { medicines: [] },
            };
        }
    }

    /**
     * Get recent searches
     * @param {number} limit - Number of items to fetch
     * @returns {Promise} - List of recent searches
     */
    async getRecentSearches(limit = 10) {
        try {
            const response = await apiClient.get(
                API_CONFIG.ENDPOINTS.MEDICINE.RECENT_SEARCHES,
                { limit }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Get recent searches error:', error);
            // Don't error out hard, just return empty
            return {
                success: false,
                data: { searches: [] },
            };
        }
    }

    /**
     * Get medicine by ID
     * @param {string} id - Medicine ID
     * @returns {Promise} - Medicine details
     */
    async getMedicineById(id) {
        try {
            const response = await apiClient.get(
                `${API_CONFIG.ENDPOINTS.MEDICINE.GET_BY_ID}/${id}`
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Get medicine error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get medicine details',
            };
        }
    }
}

export default new SearchService();
