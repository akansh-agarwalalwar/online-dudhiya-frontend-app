import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Payment Service
 * Handles all payment-related API calls
 */
class PaymentService {
    /**
     * Initiate Razorpay payment
     * @param {string} orderId - Order ID
     * @returns {Promise} - API response with Razorpay order details
     */
    async initiatePayment(orderId) {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.PAYMENT.INITIATE,
                { orderId }
            );
            return response;
        } catch (error) {
            console.error('❌ Initiate payment error:', error);
            throw error;
        }
    }

    /**
     * Verify Razorpay payment
     * @param {Object} paymentData - Payment verification data
     * @param {string} orderId - Order ID
     * @returns {Promise} - API response
     */
    async verifyPayment(paymentData, orderId) {
        try {
            const response = await apiClient.post(
                `${API_CONFIG.ENDPOINTS.PAYMENT.VERIFY}?orderId=${orderId}`,
                paymentData
            );
            return response;
        } catch (error) {
            console.error('❌ Verify payment error:', error);
            throw error;
        }
    }

    /**
     * Initiate refund
     * @param {string} orderId - Order ID
     * @param {number} refundAmount - Refund amount (optional)
     * @returns {Promise} - API response
     */
    async initiateRefund(orderId, refundAmount = null) {
        try {
            const payload = { orderId };
            if (refundAmount) {
                payload.refundAmount = refundAmount;
            }

            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.PAYMENT.REFUND,
                payload
            );
            return response;
        } catch (error) {
            console.error('❌ Initiate refund error:', error);
            throw error;
        }
    }
}

export default new PaymentService();
