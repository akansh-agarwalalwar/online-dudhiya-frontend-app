import apiClient from './apiClient';
import API_CONFIG from '../config/api';

/**
 * Image Upload Service - Handles image uploads to Cloudinary
 */
class ImageUploadService {
    /**
     * Get Cloudinary signature for secure uploads
     * @param {string} folder - Cloudinary folder name
     * @returns {Promise} Signature data
     */
    async getCloudinarySignature(folder = 'profile_pictures') {
        try {
            const response = await apiClient.post(
                API_CONFIG.ENDPOINTS.CLOUDINARY.GET_SIGNATURE,
                { folder }
            );
            return response.data;
        } catch (error) {
            console.error('Get Cloudinary signature error:', error);
            throw error;
        }
    }

    /**
     * Upload image to Cloudinary
     * @param {string} imageUri - Local image URI
     * @param {string} folder - Cloudinary folder name
     * @returns {Promise} Uploaded image URL
     */
    async uploadImage(imageUri, folder = 'profile_pictures') {
        try {
            // Get signature from backend
            const signatureData = await this.getCloudinarySignature(folder);
            const { signature, timestamp, cloudname, api_key } = signatureData;

            // Prepare form data
            const formData = new FormData();

            // Add image file
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: imageUri,
                type,
                name: filename,
            });

            // Add Cloudinary parameters
            formData.append('api_key', api_key);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('folder', folder);

            // Upload to Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`;

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();
            return data.secure_url; // Return the secure URL of uploaded image
        } catch (error) {
            console.error('Upload image error:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new ImageUploadService();
