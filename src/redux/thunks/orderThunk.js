import { createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

/**
 * Create a product order
 */
export const createProductOrder = createAsyncThunk(
    'order/createProductOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderService.createProductOrder(orderData);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to create order'
            );
        }
    }
);

/**
 * Get order by ID
 */
export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrderById(orderId);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to fetch order'
            );
        }
    }
);

/**
 * Get customer orders
 */
export const getCustomerOrders = createAsyncThunk(
    'order/getCustomerOrders',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await orderService.getCustomerOrders(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to fetch orders'
            );
        }
    }
);

/**
 * Cancel order
 */
export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const response = await orderService.cancelOrder(orderId, reason);
            return response.data.order;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to cancel order'
            );
        }
    }
);
