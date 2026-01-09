import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  isGuest: false,
  redirectScreen: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      state.isGuest = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    guestLogin: (state) => {
      state.isGuest = true;
      state.isAuthenticated = false; // Guest is not authenticated in the traditional sense
      state.user = null;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isGuest = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRedirectScreen: (state, action) => {
      state.redirectScreen = action.payload;
    },
    clearRedirectScreen: (state) => {
      state.redirectScreen = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  guestLogin,
  setRedirectScreen,
  clearRedirectScreen,
} = authSlice.actions;

export default authSlice.reducer;