import apiClient, { ApiError } from './apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Common Service
 * Handles common API calls like delivery charges
 */
class CommonService {
    /**
     * Get active delivery charge
     * @returns {Promise<object>} - Delivery charge data
     */
    async getDeliveryCharge() {
        try {
            console.log('📦 Fetching delivery charge...');

            const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMON.GET_DELIVERY_CHARGE);

            console.log('✅ Delivery charge fetched successfully:', response.data);

            return {
                success: true,
                data: response.data,
                message: response.message || 'Delivery charge fetched successfully',
            };

        } catch (error) {
            console.error('❌ Failed to fetch delivery charge:', error);

            if (error instanceof ApiError) {
                throw new Error(error.message || 'Failed to fetch delivery charge');
            }

            throw new Error('Network error. Please check your connection.');
        }
    }

    /**
     * Calculate delivery charge based on cart total
     * @param {number} cartTotal - Total cart amount
     * @param {object} deliveryChargeData - Delivery charge configuration
     * @returns {object} - Calculated delivery charge info
     */
    calculateDeliveryCharge(cartTotal, deliveryChargeData) {
        if (!deliveryChargeData) {
            return {
                amount: 0,
                isFree: true,
                message: 'Free Delivery',
            };
        }

        const { amount, min_purchase_amount } = deliveryChargeData;
        const minPurchase = parseFloat(min_purchase_amount || 0);
        const deliveryAmount = parseFloat(amount || 0);

        // If cart total is greater than or equal to minimum purchase amount, delivery is free
        if (cartTotal >= minPurchase) {
            return {
                amount: 0,
                isFree: true,
                message: 'Free Delivery',
                minPurchaseAmount: minPurchase,
            };
        }

        // Otherwise, charge delivery fee
        return {
            amount: deliveryAmount,
            isFree: false,
            message: `₹${deliveryAmount.toFixed(2)}`,
            minPurchaseAmount: minPurchase,
            amountToFreeDelivery: minPurchase - cartTotal,
        };
    }
}

// Export singleton instance
export default new CommonService();
