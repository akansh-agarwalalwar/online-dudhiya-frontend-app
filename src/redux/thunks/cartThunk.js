import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';
import { API_CONFIG } from '../../config/api';

/**
 * Add item to cart
 * @param {Object} payload - { medicineId, quantity, sizeId? }
 */
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.CART.ADD_TO_CART,
                payload
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to add item to cart'
            );
        }
    }
);

/**
 * Fetch user's cart
 */
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.CART.GET_CART);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to fetch cart'
            );
        }
    }
);

/**
 * Update cart item quantity
 * @param {Object} payload - { itemId, quantity }
 */
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(
                `${API_CONFIG.ENDPOINTS.CART.UPDATE_ITEM}/${itemId}`,
                { quantity }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to update cart item'
            );
        }
    }
);

/**
 * Delete cart item
 * @param {string} itemId - Cart item ID
 */
export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `${API_CONFIG.ENDPOINTS.CART.DELETE_ITEM}/${itemId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to delete cart item'
            );
        }
    }
);

/**
 * Get cart count
 */
export const fetchCartCount = createAsyncThunk(
    'cart/fetchCartCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.CART.GET_COUNT);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to fetch cart count'
            );
        }
    }
);

/**
 * Clear entire cart
 */
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CART.CLEAR_CART);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.data?.message || error.message || 'Failed to clear cart'
            );
        }
    }
);
