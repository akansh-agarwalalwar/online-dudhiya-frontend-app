import { createSlice } from '@reduxjs/toolkit';
import {
  calculateTotalPrice,
  calculateTotalQuantity,
  validateCartItem,
  findCartItem,
} from '../../utils/cartUtils';

const initialState = {
  items: [],
  deliveryOption: 'delivery', // 'delivery' or 'pickup'
  deliveryAddress: '123 MG Road, Delhi, India 110001',
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      
      if (!validateCartItem(newItem)) {
        state.error = 'Invalid item data';
        return;
      }

      const existingItem = findCartItem(state.items, newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }
      
      state.error = null;
    },

    removeItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== itemId);
        return;
      }

      const item = findCartItem(state.items, itemId);
      if (item) {
        item.quantity = quantity;
      }
    },

    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = findCartItem(state.items, itemId);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = findCartItem(state.items, itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== itemId);
        }
      }
    },

    toggleFavorite: (state, action) => {
      const itemId = action.payload;
      const item = findCartItem(state.items, itemId);
      if (item) {
        item.isFavorite = !item.isFavorite;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },

    setDeliveryOption: (state, action) => {
      state.deliveryOption = action.payload;
    },

    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  toggleFavorite,
  clearCart,
  setDeliveryOption,
  setDeliveryAddress,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => calculateTotalQuantity(state.cart.items);
export const selectCartTotalPrice = (state) => calculateTotalPrice(state.cart.items);
export const selectDeliveryOption = (state) => state.cart.deliveryOption;
export const selectDeliveryAddress = (state) => state.cart.deliveryAddress;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectIsCartEmpty = (state) => state.cart.items.length === 0;

// Complex selectors
export const selectCartItemById = (state, itemId) => 
  findCartItem(state.cart.items, itemId);

export const selectItemQuantityById = (state, itemId) => {
  const item = findCartItem(state.cart.items, itemId);
  return item ? item.quantity : 0;
};

export const selectIsItemInCart = (state, itemId) =>
  state.cart.items.some(item => item.id === itemId);

export default cartSlice.reducer;