import axios from 'axios';
import { API_CONFIG } from '../config/api';

class BannerService {
    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: API_CONFIG.HEADERS,
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(error)
        );
    }

    async getBanners() {
        try {
            const response = await this.api.get(API_CONFIG.ENDPOINTS.BANNERS.GET_ALL);
            if (response.data && response.data.data && response.data.data.banners) {
                return response.data.data.banners.map(b => b.imageUrl);
            }
            return [];
        } catch (error) {
            console.error('Error fetching banners:', error);
            return [];
        }
    }
}

export const bannerService = new BannerService();
export default bannerService;
