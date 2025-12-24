import API_CONFIG from '../config/api.js';

class CategoryService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Create request headers with common configuration
   */
  getHeaders() {
    return {
      ...API_CONFIG.HEADERS,
    };
  }

  /**
   * Generic fetch wrapper with timeout and error handling
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    };

    console.log('CategoryService: Making request to:', url);
    console.log('CategoryService: Request options:', requestOptions);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('CategoryService: Response status:', response.status);
      console.log('CategoryService: Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('CategoryService: Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('CategoryService: Response data:', data);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('CategoryService: Request failed:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Please check your connection');
      }
      
      throw new Error(error.message || 'Network error occurred');
    }
  }

  /**
   * Fetch all categories
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of categories to fetch
   * @param {number} params.offset - Offset for pagination
   * @param {string} params.search_term - Search term for filtering
   * @returns {Promise<Object>} Categories response
   */
  async getCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        limit: 50, // Default to fetch more categories
        offset: 0,
        ...params,
      }).toString();

      const endpoint = `${API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL}?${queryParams}`;
      console.log('CategoryService: Fetching categories from:', endpoint);
      
      const response = await this.makeRequest(endpoint, {
        method: 'GET',
      });

      console.log('CategoryService: Raw API response:', response);
      const formattedResponse = this.formatCategoriesResponse(response);
      console.log('CategoryService: Formatted response:', formattedResponse);
      
      return formattedResponse;
    } catch (error) {
      console.error('CategoryService.getCategories error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Fetch category by ID or slug
   * @param {string} idOrSlug - Category ID or slug
   * @returns {Promise<Object>} Category response
   */
  async getCategoryById(idOrSlug) {
    try {
      const endpoint = `${API_CONFIG.ENDPOINTS.CATEGORIES.GET_BY_ID}/${idOrSlug}`;
      const response = await this.makeRequest(endpoint, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('CategoryService.getCategoryById error:', error);
      throw error;
    }
  }

  /**
   * Format categories response for consistent data structure
   * @param {Object} response - Raw API response
   * @returns {Object} Formatted response
   */
  formatCategoriesResponse(response) {
    // Check if response is successful (backend uses status: 'success')
    if (response.status === 'success' && response.data) {
      const { categories, total_count } = response.data;
      
      // Ensure categories is an array
      if (!Array.isArray(categories)) {
        throw new Error('Categories data is not in expected array format');
      }
      
      // Transform categories to match our component expectations
      const formattedCategories = categories.map(category => ({
        id: category.id,
        title: category.name,
        name: category.name,
        slug: category.slug,
        image: category.imageUrl || null,
        imageUrl: category.imageUrl || null,
        isActive: category.is_active,
        subcategories: category.subcategories || [],
        subCategoryCount: category.sub_category_count || 0,
        // Add a default background color if not provided
        bg: this.getDefaultCategoryColor(category.id),
      }));

      return {
        success: true,
        data: {
          categories: formattedCategories,
          total: total_count || 0,
          count: formattedCategories.length,
        },
        message: response.message || 'Categories fetched successfully',
      };
    }

    // If response has an error status
    if (response.status === 'error') {
      throw new Error(response.message || 'API returned an error');
    }

    // If response structure is unexpected
    throw new Error('Invalid response format from server');
  }

  /**
   * Generate default background colors for categories
   * @param {number} categoryId - Category ID
   * @returns {string} Hex color code
   */
  getDefaultCategoryColor(categoryId) {
    const colors = [
      '#E8F6FF', // Light blue
      '#E6FFE9', // Light green
      '#FFF8D9', // Light yellow
      '#FFECEC', // Light pink
      '#F0E6FF', // Light purple
      '#E6F7FF', // Light cyan
      '#FFF2E6', // Light orange
      '#E6FFE6', // Very light green
    ];
    
    return colors[categoryId % colors.length];
  }

  /**
   * Search categories by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Object>} Search results
   */
  async searchCategories(searchTerm) {
    try {
      return await this.getCategories({ search_term: searchTerm });
    } catch (error) {
      console.error('CategoryService.searchCategories error:', error);
      throw error;
    }
  }
}

export default new CategoryService();