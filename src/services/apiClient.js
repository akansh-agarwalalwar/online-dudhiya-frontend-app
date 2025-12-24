import { API_CONFIG } from '../config/api';

/**
 * API Client for making HTTP requests
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  /**
   * Makes an HTTP request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise} - API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders },
      ...options,
    };

    // Add Authorization header if token exists
    const token = await this.getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`, {
        headers: config.headers,
        body: config.body,
      });

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(data.message || 'API request failed', response.status, data);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
        status: response.status,
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error.message || 'Network error',
        error.status || 0
      );
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Get stored authentication token
   */
  async getStoredToken() {
    try {
      const { getAuthToken } = await import('./tokenStorage');
      return await getAuthToken();
    } catch (error) {
      console.warn('Failed to get stored token:', error);
      return null;
    }
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isTimeoutError() {
    return this.status === 408;
  }

  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
}

// Export singleton instance
export default new ApiClient();