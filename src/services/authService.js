import apiClient, { ApiError } from './apiClient';
import { API_CONFIG } from '../config/api';
import {
  storeAuthToken,
  storeUserData,
  getUserData,
  storeLastLogin,
  clearAuthData,
  hasValidAuth,
  getUserFromToken
} from './tokenStorage';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
class AuthService {

  /**
   * Request OTP for phone number
   * @param {string} phoneNumber - 10-digit phone number
   * @param {string} purpose - OTP purpose (LOGIN, SIGNUP, RESET)
   * @returns {Promise<object>} - API response
   */
  async requestOTP(phoneNumber, purpose = 'LOGIN') {
    try {
      console.log('📱 Requesting OTP for:', phoneNumber);

      // Validate phone number
      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OTP_REQUEST, {
        phone_number: phoneNumber,
        purpose: purpose.toUpperCase(),
      });

      console.log('✅ OTP request successful:', response.message);

      return {
        success: true,
        message: response.message || 'OTP sent successfully',
        data: response.data,
      };

    } catch (error) {
      console.error('❌ OTP request failed:', error);

      if (error instanceof ApiError) {
        if (error.status === 429) {
          throw new Error('Too many OTP requests. Please try again later.');
        }
        throw new Error(error.message || 'Failed to send OTP');
      }

      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Verify OTP and authenticate user
   * @param {string} phoneNumber - 10-digit phone number
   * @param {string} otpCode - 6-digit OTP code
   * @returns {Promise<object>} - Authentication result
   */
  async verifyOTP(phoneNumber, otpCode) {
    try {
      console.log('🔐 Verifying OTP for:', phoneNumber);

      // Validate inputs
      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!otpCode || !/^\d{6}$/.test(otpCode)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OTP_VERIFY, {
        phone_number: phoneNumber,
        otp_code: otpCode,
      });

      console.log('✅ OTP verification successful');

      // Extract token and user data from response
      const { access_token, is_profile_complete } = response.data;

      if (!access_token) {
        throw new Error('Authentication token not received');
      }

      // Store authentication data securely
      await this.storeAuthenticationData(access_token, {
        phone_number: phoneNumber,
        is_profile_complete,
      });

      console.log('💾 Authentication data stored successfully');

      return {
        success: true,
        message: response.message || 'OTP verified successfully',
        user: {
          phone_number: phoneNumber,
          is_profile_complete,
        },
        token: access_token,
      };

    } catch (error) {
      console.error('❌ OTP verification failed:', error);

      if (error instanceof ApiError) {
        if (error.status === 400) {
          throw new Error('Invalid or expired OTP. Please try again.');
        }
        throw new Error(error.message || 'OTP verification failed');
      }

      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Authentication result
   */
  async login(email, password) {
    try {
      console.log('🔐 Logging in user:', email);

      // Validate inputs
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!password || password.length < 1) {
        throw new Error('Please enter your password');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('✅ Login successful');

      // Extract token from response
      const { token } = response.data;

      if (!token) {
        throw new Error('Authentication token not received');
      }

      // Store authentication data
      await this.storeAuthenticationData(token, { email });

      console.log('💾 Authentication data stored successfully');

      return {
        success: true,
        message: response.message || 'Login successful',
        token,
        user: { email },
      };

    } catch (error) {
      console.error('❌ Login failed:', error);

      if (error instanceof ApiError) {
        if (error.status === 404) {
          throw new Error('User not found. Please check your credentials.');
        }
        if (error.status === 401) {
          throw new Error('Invalid password. Please try again.');
        }
        throw new Error(error.message || 'Login failed');
      }

      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Google Authentication
   * @param {string} idToken - Google ID token
   * @returns {Promise<object>} - Authentication result
   */
  async googleAuth(idToken) {
    try {
      console.log('🔐 Google authentication started');

      if (!idToken) {
        throw new Error('Google authentication token is required');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.GOOGLE, {
        id_token: idToken,
      });

      console.log('✅ Google authentication successful');

      const { access_token, is_profile_complete, user } = response.data;

      if (!access_token) {
        throw new Error('Authentication token not received');
      }

      // Store authentication data
      await this.storeAuthenticationData(access_token, {
        ...user,
        is_profile_complete,
      });

      return {
        success: true,
        message: response.message || 'Google authentication successful',
        token: access_token,
        user: {
          ...user,
          is_profile_complete,
        },
      };

    } catch (error) {
      console.error('❌ Google authentication failed:', error);

      if (error instanceof ApiError) {
        throw new Error(error.message || 'Google authentication failed');
      }

      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Logout user
   * @returns {Promise<object>} - Logout result
   */
  async logout() {
    try {
      console.log('🔐 Logging out user');

      // Call logout API (optional, for server-side token invalidation)
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        console.warn('⚠️ Server logout failed, continuing with local logout:', error.message);
      }

      // Clear local authentication data
      const cleared = await clearAuthData();

      if (!cleared) {
        throw new Error('Failed to clear authentication data');
      }

      console.log('✅ Logout successful');

      return {
        success: true,
        message: 'Logged out successfully',
      };

    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw new Error('Logout failed. Please try again.');
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} - Authentication status
   */
  async isAuthenticated() {
    try {
      return await hasValidAuth();
    } catch (error) {
      console.error('❌ Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user information
   * @returns {Promise<object|null>} - Current user or null
   */
  async getCurrentUser() {
    try {
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        return null;
      }

      // Get user from token
      const userFromToken = await getUserFromToken();

      // Get stored user data
      const storedUserData = await getUserData();

      return {
        ...userFromToken,
        ...storedUserData,
      };

    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  /**
   * Store authentication data securely
   * @param {string} token - JWT token
   * @param {object} userData - User data
   * @returns {Promise<void>}
   */
  async storeAuthenticationData(token, userData) {
    try {
      // Store token
      const tokenStored = await storeAuthToken(token);
      if (!tokenStored) {
        throw new Error('Failed to store authentication token');
      }

      // Store user data
      if (userData) {
        const userStored = await storeUserData(userData);
        if (!userStored) {
          console.warn('⚠️ Failed to store user data');
        }
      }

      // Store login timestamp
      const timestampStored = await storeLastLogin();
      if (!timestampStored) {
        console.warn('⚠️ Failed to store login timestamp');
      }

    } catch (error) {
      console.error('❌ Failed to store authentication data:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<object>} - Refresh result
   */
  async refreshToken() {
    try {
      console.log('🔄 Refreshing authentication token');

      // Implementation depends on your backend refresh token strategy
      // For now, we'll check if current token is still valid
      const isValid = await this.isAuthenticated();

      if (!isValid) {
        await clearAuthData();
        throw new Error('Authentication expired. Please log in again.');
      }

      return {
        success: true,
        message: 'Token is still valid',
      };

    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AuthService();