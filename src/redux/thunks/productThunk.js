import { createAsyncThunk } from "@reduxjs/toolkit";
import { productsService } from "../../services/ProductService";

export const fetchHomeSections = createAsyncThunk(
  "products/fetchHomeSections",
  async (params, { rejectWithValue }) => {
    try {
      const sections = await productsService.getHomeSections(params);
      return sections;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Something went wrong");
    }
  }
);

