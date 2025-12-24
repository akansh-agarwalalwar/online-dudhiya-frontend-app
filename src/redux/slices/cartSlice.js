import { createSlice } from '@reduxjs/toolkit';
import {
  addToCart,
  fetchCart,
  updateCartItem,
  deleteCartItem,
  fetchCartCount,
  clearCart,
} from '../thunks/cartThunk';

const initialState = {
  items: [],
  cartData: null, // Full cart response from backend
  totalItems: 0,
  subTotal: 0,
  deliveryOption: 'delivery', // 'delivery' or 'pickup'
  deliveryAddress: null,
  isLoading: false,
  error: null,
  cartCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setDeliveryOption: (state, action) => {
      state.deliveryOption = action.payload;
    },

    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Local optimistic updates (optional)
    localIncrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    localDecrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cartData = action.payload.cart || action.payload;

        if (cartData) {
          state.cartData = cartData;
          state.items = cartData.items || [];
          state.totalItems = cartData.total_items || 0;
          state.subTotal = cartData.sub_total || 0;
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add item to cart';
      });

    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const cartArray = action.payload || [];

        if (cartArray.length > 0) {
          const cartData = cartArray[0];
          state.cartData = cartData;
          state.items = cartData.items || [];
          state.totalItems = cartData.total_items || 0;
          state.subTotal = cartData.sub_total || 0;
        } else {
          // Empty cart
          state.cartData = null;
          state.items = [];
          state.totalItems = 0;
          state.subTotal = 0;
        }
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const cartData = action.payload.cart;

        if (cartData && cartData.length > 0) {
          const cart = cartData[0];
          state.cartData = cart;
          state.items = cart.items || [];
          state.totalItems = cart.total_items || 0;
          state.subTotal = cart.sub_total || 0;
        }
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update cart item';
      });

    // Delete Cart Item
    builder
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const cartData = action.payload.cart;

        if (cartData && cartData.length > 0) {
          const cart = cartData[0];
          state.cartData = cart;
          state.items = cart.items || [];
          state.totalItems = cart.total_items || 0;
          state.subTotal = cart.sub_total || 0;
        } else {
          // Cart is now empty
          state.cartData = null;
          state.items = [];
          state.totalItems = 0;
          state.subTotal = 0;
        }
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete cart item';
      });

    // Fetch Cart Count
    builder
      .addCase(fetchCartCount.pending, (state) => {
        // Don't set loading for count fetch
        state.error = null;
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.cartCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchCartCount.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch cart count';
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.cartData = null;
        state.totalItems = 0;
        state.subTotal = 0;
        state.cartCount = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

export const {
  setDeliveryOption,
  setDeliveryAddress,
  clearError,
  localIncrementQuantity,
  localDecrementQuantity,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsCount = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.subTotal;
export const selectDeliveryOption = (state) => state.cart.deliveryOption;
export const selectDeliveryAddress = (state) => state.cart.deliveryAddress;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectIsCartEmpty = (state) => state.cart.items.length === 0;
export const selectCartCount = (state) => state.cart.cartCount;
export const selectCartData = (state) => state.cart.cartData;

// Complex selectors
export const selectCartItemById = (state, itemId) =>
  state.cart.items.find(item => item.id === itemId);

export const selectItemQuantityById = (state, itemId) => {
  const item = state.cart.items.find(item => item.id === itemId);
  return item ? item.quantity : 0;
};

export const selectIsItemInCart = (state, medicineId, sizeId = null) => {
  return state.cart.items.some(item =>
    item.medicine.id === medicineId &&
    (sizeId ? item.sizeId === sizeId : !item.sizeId)
  );
};

// Get quantity of specific medicine with optional size
export const selectMedicineQuantityInCart = (state, medicineId, sizeId = null) => {
  const item = state.cart.items.find(item =>
    item.medicine.id === medicineId &&
    (sizeId ? item.sizeId === sizeId : !item.sizeId)
  );
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;