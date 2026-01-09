import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';
import { API_CONFIG } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_CART_KEY = 'guest_cart_data';

// Helper to get local cart
const getLocalCart = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(GUEST_CART_KEY);
        // Ensure structure matches what slice expects
        // items: [], total_items: 0, sub_total: 0
        return jsonValue != null ? JSON.parse(jsonValue) : { items: [], total_items: 0, sub_total: 0 };
    } catch (e) {
        return { items: [], total_items: 0, sub_total: 0 };
    }
};

// Helper to save local cart and recalculate totals
const saveLocalCart = async (cart) => {
    // Recalculate totals
    cart.total_items = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.sub_total = cart.items.reduce((sum, item) => {
        let price = 0;
        // Try to find price from size or fallback to product price
        if (item.sizeId && item.medicine.sizes) {
            const size = item.medicine.sizes.find(s => s.id === item.sizeId);
            if (size) price = Number(size.salePrice) || 0;
        } else {
            price = Number(item.medicine.sale_price) || 0;
        }
        return sum + (price * item.quantity);
    }, 0);

    try {
        await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error("Failed to save local cart", e);
    }
    return cart;
};

/**
 * Add item to cart
 * @param {Object} payload - { medicineId, quantity, sizeId?, product? }
 */
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload, { rejectWithValue, getState }) => {
        // Separate product object from payload intended for API
        const { product, ...apiPayload } = payload;
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                let cart = await getLocalCart();
                const { medicineId, quantity, sizeId } = apiPayload;

                // Check if item exists
                const existingItemIndex = cart.items.findIndex(item =>
                    item.medicine.id === medicineId &&
                    (sizeId ? item.sizeId === sizeId : !item.sizeId)
                );

                if (existingItemIndex >= 0) {
                    cart.items[existingItemIndex].quantity += quantity;
                } else {
                    if (!product) {
                        return rejectWithValue("Product details missing for guest cart");
                    }
                    // Create new item
                    cart.items.push({
                        id: Date.now().toString(), // Local temporary ID
                        medicine: product,
                        quantity,
                        sizeId: sizeId || null,
                    });
                }

                const updatedCart = await saveLocalCart(cart);
                // Return structure matching API response: { cart: ... } or just cart data
                // Looking at slice: const cartData = action.payload.cart || action.payload;
                return { cart: updatedCart };
            } catch (error) {
                return rejectWithValue('Failed to add to guest cart');
            }
        }

        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.CART.ADD_TO_CART,
                apiPayload
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
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                const cart = await getLocalCart();
                // Return as array because slice expects: const cartArray = action.payload || [];
                // and then uses cartArray[0].
                return [cart];
            } catch (error) {
                return rejectWithValue('Failed to fetch guest cart');
            }
        }

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
    async ({ itemId, quantity }, { rejectWithValue, getState }) => {
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                let cart = await getLocalCart();
                const itemIndex = cart.items.findIndex(item => item.id === itemId);

                if (itemIndex >= 0) {
                    if (quantity > 0) {
                        cart.items[itemIndex].quantity = quantity;
                    } else {
                        // Ideally delete should be called but in case update is called with 0
                        cart.items.splice(itemIndex, 1);
                    }
                    const updatedCart = await saveLocalCart(cart);
                    return { cart: [updatedCart] }; // Matches update response structure usually? 
                    // Slice: const cartData = action.payload.cart; -> expects { cart: [ ... ] } or object
                    // In slice: const cartData = action.payload.cart; if (cartData && cartData.length > 0) ...
                    // So API returns { cart: [ { items... } ] }
                } else {
                    return rejectWithValue("Item not found in guest cart");
                }
            } catch (error) {
                return rejectWithValue('Failed to update guest cart');
            }
        }

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
    async (itemId, { rejectWithValue, getState }) => {
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                let cart = await getLocalCart();
                const initialLength = cart.items.length;
                cart.items = cart.items.filter(item => item.id !== itemId);

                if (cart.items.length === initialLength) {
                    return rejectWithValue("Item not found in guest cart");
                }

                const updatedCart = await saveLocalCart(cart);
                // Slice: const cartData = action.payload.cart;
                return { cart: [updatedCart] };
            } catch (error) {
                return rejectWithValue('Failed to delete from guest cart');
            }
        }

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
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                const cart = await getLocalCart();
                return { count: cart.total_items };
            } catch (error) {
                return { count: 0 };
            }
        }

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
    async (_, { rejectWithValue, getState }) => {
        const { auth } = getState();

        if (auth.isGuest || !auth.isAuthenticated) {
            try {
                const cart = { items: [], total_items: 0, sub_total: 0 };
                await AsyncStorage.removeItem(GUEST_CART_KEY);
                return { message: "Cart cleared" };
            } catch (error) {
                return rejectWithValue('Failed to clear guest cart');
            }
        }

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
