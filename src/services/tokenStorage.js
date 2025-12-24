import AsyncStorage from '@react-native-async-storage/async-storage';
// Uncomment the following line when you install react-native-keychain
// import * as Keychain from 'react-native-keychain';

/**
 * Token Storage Service
 * Handles secure storage and retrieval of authentication tokens
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  LAST_LOGIN: 'lastLogin',
};

/**
 * Secure storage implementation
 * Falls back to AsyncStorage if Keychain is not available
 */
class TokenStorage {
  constructor() {
    this.useKeychain = false; // Set to true when react-native-keychain is installed
  }

  /**
   * Store a secure item
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {Promise<boolean>} - Success status
   */
  async setSecureItem(key, value) {
    try {
      if (this.useKeychain) {
        // Uncomment when react-native-keychain is installed
        // await Keychain.setInternetCredentials(key, key, value);
        // console.log(`🔐 Stored ${key} in Keychain`);
      } else {
        await AsyncStorage.setItem(key, value);
        console.log(`💾 Stored ${key} in AsyncStorage`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Failed to store ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve a secure item
   * @param {string} key - Storage key
   * @returns {Promise<string|null>} - Retrieved value or null
   */
  async getSecureItem(key) {
    try {
      if (this.useKeychain) {
        // Uncomment when react-native-keychain is installed
        // const credentials = await Keychain.getInternetCredentials(key);
        // if (credentials) {
        //   console.log(`🔐 Retrieved ${key} from Keychain`);
        //   return credentials.password;
        // }
        // return null;
      } else {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          console.log(`💾 Retrieved ${key} from AsyncStorage`);
        }
        return value;
      }
    } catch (error) {
      console.error(`❌ Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove a secure item
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} - Success status
   */
  async removeSecureItem(key) {
    try {
      if (this.useKeychain) {
        // Uncomment when react-native-keychain is installed
        // await Keychain.resetInternetCredentials(key);
        // console.log(`🔐 Removed ${key} from Keychain`);
      } else {
        await AsyncStorage.removeItem(key);
        console.log(`💾 Removed ${key} from AsyncStorage`);
      }
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
      return false;
    }
  }

  /**
   * Store authentication token
   * @param {string} token - JWT token
   * @returns {Promise<boolean>} - Success status
   */
  async storeAuthToken(token) {
    if (!token) {
      console.warn('⚠️ Attempted to store empty auth token');
      return false;
    }
    return this.setSecureItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Retrieve authentication token
   * @returns {Promise<string|null>} - JWT token or null
   */
  async getAuthToken() {
    return this.getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Store refresh token
   * @param {string} token - Refresh token
   * @returns {Promise<boolean>} - Success status
   */
  async storeRefreshToken(token) {
    if (!token) {
      console.warn('⚠️ Attempted to store empty refresh token');
      return false;
    }
    return this.setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Retrieve refresh token
   * @returns {Promise<string|null>} - Refresh token or null
   */
  async getRefreshToken() {
    return this.getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store user data
   * @param {object} userData - User information
   * @returns {Promise<boolean>} - Success status
   */
  async storeUserData(userData) {
    try {
      const jsonString = JSON.stringify(userData);
      return this.setSecureItem(STORAGE_KEYS.USER_DATA, jsonString);
    } catch (error) {
      console.error('❌ Failed to stringify user data:', error);
      return false;
    }
  }

  /**
   * Retrieve user data
   * @returns {Promise<object|null>} - User data or null
   */
  async getUserData() {
    try {
      const jsonString = await this.getSecureItem(STORAGE_KEYS.USER_DATA);
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('❌ Failed to parse user data:', error);
      return null;
    }
  }

  /**
   * Store last login timestamp
   * @returns {Promise<boolean>} - Success status
   */
  async storeLastLogin() {
    const timestamp = new Date().toISOString();
    return this.setSecureItem(STORAGE_KEYS.LAST_LOGIN, timestamp);
  }

  /**
   * Clear all authentication data
   * @returns {Promise<boolean>} - Success status
   */
  async clearAuthData() {
    try {
      const promises = Object.values(STORAGE_KEYS).map(key => 
        this.removeSecureItem(key)
      );
      
      const results = await Promise.all(promises);
      const success = results.every(result => result === true);
      
      if (success) {
        console.log('🧹 Cleared all authentication data');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
      return false;
    }
  }

  /**
   * Check if user has valid authentication
   * @returns {Promise<boolean>} - Has valid auth status
   */
  async hasValidAuth() {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        return false;
      }

      // Basic JWT validation (check if it's not expired)
      const payload = this.decodeJWTPayload(token);
      if (!payload || !payload.exp) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      if (isExpired) {
        console.log('🔐 Token expired, clearing auth data');
        await this.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error checking auth validity:', error);
      return false;
    }
  }

  /**
   * Decode JWT payload without verification
   * @param {string} token - JWT token
   * @returns {object|null} - Decoded payload or null
   */
  decodeJWTPayload(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Failed to decode JWT:', error);
      return null;
    }
  }

  /**
   * Get user info from stored token
   * @returns {Promise<object|null>} - User info or null
   */
  async getUserFromToken() {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return null;
      }

      const payload = this.decodeJWTPayload(token);
      if (!payload) {
        return null;
      }

      return {
        id: payload.id,
        user_type: payload.user_type,
        exp: payload.exp,
      };
    } catch (error) {
      console.error('❌ Failed to get user from token:', error);
      return null;
    }
  }
}

// Export singleton instance and individual functions
const tokenStorage = new TokenStorage();

// Export bound methods to preserve 'this' context
export const setSecureItem = tokenStorage.setSecureItem.bind(tokenStorage);
export const getSecureItem = tokenStorage.getSecureItem.bind(tokenStorage);
export const removeSecureItem = tokenStorage.removeSecureItem.bind(tokenStorage);
export const storeAuthToken = tokenStorage.storeAuthToken.bind(tokenStorage);
export const getAuthToken = tokenStorage.getAuthToken.bind(tokenStorage);
export const storeRefreshToken = tokenStorage.storeRefreshToken.bind(tokenStorage);
export const getRefreshToken = tokenStorage.getRefreshToken.bind(tokenStorage);
export const storeUserData = tokenStorage.storeUserData.bind(tokenStorage);
export const getUserData = tokenStorage.getUserData.bind(tokenStorage);
export const storeLastLogin = tokenStorage.storeLastLogin.bind(tokenStorage);
export const clearAuthData = tokenStorage.clearAuthData.bind(tokenStorage);
export const hasValidAuth = tokenStorage.hasValidAuth.bind(tokenStorage);
export const getUserFromToken = tokenStorage.getUserFromToken.bind(tokenStorage);

export default tokenStorage;