import API_CONFIG from '../config/api';
import apiClient from './apiClient';

/**
 * Address Service - Handles address operations
 */
class AddressService {
    /**
     * Get all addresses for the current user
     * @returns {Promise} List of addresses
     */
    async getAddresses() {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADDRESS.GET_ALL);
            return response;
        } catch (error) {
            console.error('Get addresses error:', error);
            throw error;
        }
    }

    /**
     * Get a single address by ID
     * @param {string} addressId - Address ID
     * @returns {Promise} Address data
     */
    async getAddressById(addressId) {
        try {
            const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ADDRESS.GET_BY_ID}/${addressId}`);
            return response;
        } catch (error) {
            console.error('Get address error:', error);
            throw error;
        }
    }

    /**
     * Create a new address
     * @param {object} addressData - Address data
     * @returns {Promise} Created address
     */
    async createAddress(addressData) {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.ADDRESS.CREATE,
                addressData
            );
            return response;
        } catch (error) {
            console.error('Create address error:', error);
            throw error;
        }
    }

    /**
     * Update an address
     * @param {string} addressId - Address ID
     * @param {object} addressData - Updated address data
     * @returns {Promise} Updated address
     */
    async updateAddress(addressId, addressData) {
        try {
            const response = await apiClient.patch(
                `${API_CONFIG.ENDPOINTS.ADDRESS.UPDATE}/${addressId}`,
                addressData
            );
            return response;
        } catch (error) {
            console.error('Update address error:', error);
            throw error;
        }
    }

    /**
     * Delete an address
     * @param {string} addressId - Address ID
     * @returns {Promise} Deletion confirmation
     */
    async deleteAddress(addressId) {
        try {
            const response = await apiClient.delete(
                `${API_CONFIG.ENDPOINTS.ADDRESS.DELETE}/${addressId}`
            );
            return response;
        } catch (error) {
            console.error('Delete address error:', error);
            throw error;
        }
    }

    /**
     * Set an address as default
     * @param {string} addressId - Address ID
     * @returns {Promise} Updated address
     */
    async setDefaultAddress(addressId) {
        try {
            const response = await apiClient.patch(
                `${API_CONFIG.ENDPOINTS.ADDRESS.SET_DEFAULT}/${addressId}/set-default`
            );
            return response;
        } catch (error) {
            console.error('Set default address error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new AddressService();
