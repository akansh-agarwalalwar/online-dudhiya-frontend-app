import { createSlice } from "@reduxjs/toolkit";
import { fetchHomeSections } from "../thunks/productThunk";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    sections: [],
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
        state.sections = action.payload;
      })

      .addCase(fetchHomeSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default productsSlice.reducer;
