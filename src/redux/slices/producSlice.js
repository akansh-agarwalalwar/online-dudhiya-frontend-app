import { createSlice } from "@reduxjs/toolkit";
import { fetchHomeSections } from "../thunks/productThunk";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
    error: null
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchHomeSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHomeSections.fulfilled, (state, action) => {
        state.loading = false;
        const { offset } = action.meta.arg;
        if (offset && offset > 0) {
          state.products = [...state.products, ...action.payload];
        } else {
          state.products = action.payload;
        }
      })

      .addCase(fetchHomeSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default productsSlice.reducer;
