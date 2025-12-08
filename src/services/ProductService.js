import ProductData from "../config/ProductData.json";

export const productsService = {
  async getHomeSections() {
    try {
      // Simulate API delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return the sections data from local JSON file
      return ProductData.sections;
    } catch (error) {
      console.error("Error loading ProductData:", error);
      throw error;
    }
  }
};
