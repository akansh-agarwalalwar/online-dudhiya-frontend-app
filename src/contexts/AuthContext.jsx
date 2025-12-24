import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

// Authentication context
const AuthContext = createContext(null);

// Authentication state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
};

// Authentication actions
export const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Authentication reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: currentUser,
              token: 'stored_token', // We don't expose the actual token
            },
          });
          console.log('✅ User restored from storage');
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('❌ Auth status check failed:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  /**
   * Request OTP for phone number
   */
  const requestOTP = async (phoneNumber, purpose = 'LOGIN') => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.requestOTP(phoneNumber, purpose);
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      return result;
    } catch (error) {
      console.error('❌ OTP request failed:', error);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || 'Failed to send OTP',
      });
      
      throw error;
    }
  };

  /**
   * Verify OTP and authenticate user
   */
  const verifyOTP = async (phoneNumber, otpCode) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.verifyOTP(phoneNumber, otpCode);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          token: result.token,
        },
      });
      
      console.log('✅ OTP verification successful in context');
      
      return result;
    } catch (error) {
      console.error('❌ OTP verification failed in context:', error);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || 'OTP verification failed',
      });
      
      throw error;
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.login(email, password);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          token: result.token,
        },
      });
      
      console.log('✅ Login successful in context');
      
      return result;
    } catch (error) {
      console.error('❌ Login failed in context:', error);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || 'Login failed',
      });
      
      throw error;
    }
  };

  /**
   * Google Authentication
   */
  const googleAuth = async (idToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.googleAuth(idToken);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: result.user,
          token: result.token,
        },
      });
      
      console.log('✅ Google authentication successful in context');
      
      return result;
    } catch (error) {
      console.error('❌ Google authentication failed in context:', error);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || 'Google authentication failed',
      });
      
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      await authService.logout();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      console.log('✅ Logout successful in context');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Logout failed in context:', error);
      
      // Even if server logout fails, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      throw error;
    }
  };

  /**
   * Update user information
   */
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  /**
   * Clear authentication error
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      return { success: true };
    } catch (error) {
      console.error('❌ Token refresh failed in context:', error);
      
      // Token refresh failed, logout user
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      throw error;
    }
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    requestOTP,
    verifyOTP,
    login,
    googleAuth,
    logout,
    updateUser,
    clearError,
    refreshToken,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook for authentication actions only
 */
export function useAuthActions() {
  const { 
    requestOTP, 
    verifyOTP, 
    login, 
    googleAuth, 
    logout, 
    updateUser, 
    clearError,
    refreshToken,
  } = useAuth();
  
  return {
    requestOTP,
    verifyOTP,
    login,
    googleAuth,
    logout,
    updateUser,
    clearError,
    refreshToken,
  };
}

/**
 * Hook for authentication state only
 */
export function useAuthState() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error 
  } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error,
  };
}