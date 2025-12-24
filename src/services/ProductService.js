import apizClient from "./apiClient";
export const productsService = {
  async getHomeSections(params) { // Accept params as an argument
    try {
      const response = await apizClient.get('/api/v1/medicine', params);
      console.log("Fetching ProductData with params:", params);
      console.log("ProductData loaded:", response.data.medicines);
      return response.data.medicines;
    } catch (error) {
      console.error("Error loading ProductData:", error);
      throw error;
    }
  }
};
