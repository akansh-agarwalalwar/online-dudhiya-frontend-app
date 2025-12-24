import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Order Service
 * Handles all order-related API calls
 */
class OrderService {
    /**
     * Create a product order
     * @param {Object} orderData - Order data
     * @returns {Promise} - API response
     */
    async createProductOrder(orderData) {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.ORDER.CREATE_PRODUCT,
                orderData
            );
            return response;
        } catch (error) {
            console.error('❌ Create product order error:', error);
            throw error;
        }
    }

    /**
     * Get order by ID
     * @param {string} orderId - Order ID
     * @returns {Promise} - API response
     */
    async getOrderById(orderId) {
        try {
            const response = await apiClient.get(
                `${API_CONFIG.ENDPOINTS.ORDER.GET_BY_ID}/${orderId}`
            );
            return response;
        } catch (error) {
            console.error('❌ Get order error:', error);
            throw error;
        }
    }

    /**
     * Get customer orders
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    async getCustomerOrders(params = {}) {
        try {
            const response = await apiClient.get(
                API_CONFIG.ENDPOINTS.ORDER.GET_CUSTOMER_ORDERS,
                params
            );
            return response;
        } catch (error) {
            console.error('❌ Get customer orders error:', error);
            throw error;
        }
    }

    /**
     * Cancel order
     * @param {string} orderId - Order ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise} - API response
     */
    async cancelOrder(orderId, reason) {
        try {
            const response = await apiClient.post(
                `${API_CONFIG.ENDPOINTS.ORDER.CANCEL}/${orderId}`,
                { reasonOfCancel: reason }
            );
            return response;
        } catch (error) {
            console.error('❌ Cancel order error:', error);
            throw error;
        }
    }
}

export default new OrderService();
