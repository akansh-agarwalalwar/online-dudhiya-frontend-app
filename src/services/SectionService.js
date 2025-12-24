import axios from 'axios';
import { API_CONFIG } from '../config/api';

/**
 * Section Service
 * Handles all API calls related to sections
 */
class SectionService {
    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: API_CONFIG.HEADERS,
        });

        // Request interceptor for adding auth token
        this.api.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    /**
     * Get auth token from storage
     * @returns {string|null}
     */
    getAuthToken() {
        try {
            // Implement your token retrieval logic here
            // For example, from AsyncStorage or Redux store
            return null;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    /**
     * Handle API errors
     * @param {Error} error
     * @returns {Object}
     */
    handleError(error) {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data?.message || 'Server error occurred',
                status: error.response.status,
                data: error.response.data,
            };
        } else if (error.request) {
            // Request made but no response received
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
                data: null,
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'An unexpected error occurred',
                status: -1,
                data: null,
            };
        }
    }

    /**
     * Fetch all sections
     * @param {Object} params - Query parameters
     * @param {number} params.offset - Pagination offset
     * @param {number} params.limit - Number of items per page
     * @param {string} params.search_term - Search term for filtering
     * @returns {Promise<Object>}
     */
    async getAllSections(params = {}) {
        try {
            const queryParams = {
                offset: params.offset || 0,
                limit: params.limit || 20,
                search_term: params.search_term || '',
            };

            const response = await this.api.get(API_CONFIG.ENDPOINTS.SECTIONS.GET_ALL, {
                params: queryParams,
            });
            console.log('Response:', response.data);

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Error fetching sections:', error);
            throw error;
        }
    }

    /**
     * Fetch section by ID
     * @param {string} sectionId - Section ID
     * @returns {Promise<Object>}
     */
    async getSectionById(sectionId) {
        try {
            const response = await this.api.get(
                `${API_CONFIG.ENDPOINTS.SECTIONS.GET_BY_ID}/${sectionId}`
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error(`Error fetching section ${sectionId}:`, error);
            throw error;
        }
    }

    /**
     * Transform backend section data to frontend format
     * @param {Array} sections - Raw sections from backend
     * @returns {Array}
     */
    transformSectionsData(sections) {
        if (!Array.isArray(sections)) {
            return [];
        }

        const transformedSections = sections.map((section) => ({
            id: section.id,
            title: section.name,
            sectionImage: section.imageUrl,
            showSectionImage: !!section.imageUrl,
            seeAllFilter: section.see_all_filter,
            isHidden: section.isHidden,
            sequence: section.sequence,
            products: this.transformMedicinesData(section.medicines || []),
        }));

        // Sort sections by sequence
        return transformedSections.sort((a, b) => {
            const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
            const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
            return seqA - seqB;
        });
    }

    /**
   * Transform medicines data to products format
   * @param {Array} medicines - Raw medicines from backend
   * @returns {Array}
   */
    transformMedicinesData(medicines) {
        if (!Array.isArray(medicines)) {
            return [];
        }

        const transformedMedicines = medicines.map((medicine) => {
            return {
                id: medicine.id,
                // Core fields for ProductCard component
                title: medicine.product_name || medicine.productName,
                images: Array.isArray(medicine.images) ? medicine.images : [],
                isVeg: "Yes", // Default to veg, update based on your data structure
                has_sizes: medicine.has_sizes || false,
                sizes: Array.isArray(medicine.sizes) ? medicine.sizes : [],
                mrp: medicine.mrp,
                sale_price: medicine.sale_price,
                packaging_size: medicine.packaging_size || medicine.packagingSize || "",

                // Legacy/additional fields for backward compatibility
                productImage: Array.isArray(medicine.images) && medicine.images.length > 0
                    ? medicine.images[0]
                    : null,
                name: medicine.product_name || medicine.productName,
                type: medicine.type_of_medicine || medicine.typeOfMedicine,
                status: medicine.status,
                packagingSize: medicine.packaging_size || medicine.packagingSize,
                slug: medicine.slug,
                sequence: medicine.sequence,
            };
        });

        // Sort products by sequence within the section
        return transformedMedicines.sort((a, b) => {
            const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
            const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
            return seqA - seqB;
        });
    }

    /**
     * Calculate discount percentage
     * @param {number} mrp - Maximum Retail Price
     * @param {number} salePrice - Sale Price
     * @returns {number}
     */
    calculateDiscount(mrp, salePrice) {
        if (!mrp || !salePrice || mrp <= 0 || salePrice <= 0) {
            return 0;
        }
        return Math.round(((mrp - salePrice) / mrp) * 100);
    }
}

// Export singleton instance
export const sectionService = new SectionService();
export default sectionService;
