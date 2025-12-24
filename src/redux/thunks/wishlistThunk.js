import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';


// Helper to get auth token
const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

/**
 * Fetch user's wishlist
 */
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WISHLIST.GET_ALL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch wishlist'
            );
        }
    }
);

/**
 * Add item to wishlist
 */
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (medicineId, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WISHLIST.ADD_TO_WISHLIST}`,
                { medicineId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to add to wishlist'
            );
        }
    }
);

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (wishlistId, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const response = await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST}/${wishlistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return { wishlistId };
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to remove from wishlist'
            );
        }
    }
);

/**
 * Toggle wishlist item (add if not exists, remove if exists)
 */
export const toggleWishlistItem = createAsyncThunk(
    'wishlist/toggleWishlistItem',
    async (medicineId, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WISHLIST.TOGGLE_WISHLIST_ITEM}`,
                { medicineId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                medicineId,
                isInWishlist: response.data.data.isInWishlist,
            };
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to toggle wishlist'
            );
        }
    }
);

/**
 * Check if item is in wishlist
 */
export const checkWishlistItem = createAsyncThunk(
    'wishlist/checkWishlistItem',
    async (medicineId, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                return rejectWithValue('Not authenticated');
            }

            const response = await axios.get(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WISHLIST.CHECK_WISHLIST_ITEM}/${medicineId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return {
                medicineId,
                isInWishlist: response.data.data.isInWishlist,
            };
        } catch (error) {
            console.error('Error checking wishlist:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to check wishlist'
            );
        }
    }
);

/**
 * Fetch popular items (most liked medicines)
 */
export const fetchPopularItems = createAsyncThunk(
    'wishlist/fetchPopularItems',
    async (limit = 20, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEDICINE.GET_POPULAR_ITEMS}`, {
                params: { limit },
            });

            return response.data.data;
        } catch (error) {
            console.error('Error fetching popular items:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch popular items'
            );
        }
    }
);
