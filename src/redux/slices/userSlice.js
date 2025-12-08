import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  preferences: {
    notifications: true,
    language: "en",
    theme: "light",
  },
  orders: [],
  addresses: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      return initialState;
    },
  },
});

export const {
  setUserProfile,
  updateProfile,
  setUserPreferences,
  addOrder,
  updateOrder,
  addAddress,
  updateAddress,
  deleteAddress,
  setLoading,
  setError,
  clearError,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;