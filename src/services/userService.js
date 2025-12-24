import API_CONFIG from '../config/api';
import apiClient from './apiClient';

/**
 * User Service - Handles user profile operations
 */
class UserService {
    /**
     * Fetch current user profile
     * @returns {Promise} User profile data
     */
    async getMe() {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER.GET_ME);
            return response;
        } catch (error) {
            console.error('Get user profile error:', error);
            throw error;
        }
    }

    /**
     * Update current user profile
     * @param {object} profileData - Profile data to update
     * @returns {Promise} Updated user profile
     */
    async updateMe(profileData) {
        try {
            const response = await apiClient.patch(
                API_CONFIG.ENDPOINTS.USER.UPDATE_ME,
                profileData
            );
            return response;
        } catch (error) {
            console.error('Update user profile error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new UserService();
