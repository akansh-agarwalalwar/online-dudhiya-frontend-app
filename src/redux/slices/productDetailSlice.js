import { createSlice } from '@reduxjs/toolkit';
import { fetchProductDetails, fetchRelatedProducts } from '../thunks/productDetailThunk';

const initialState = {
  currentProduct: null,
  relatedProducts: [],
  loading: false,
  error: null,
  selectedSize: null,
};

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  reducers: {
    // Clear product details when navigating away
    clearProductDetails: (state) => {
      state.currentProduct = null;
      state.selectedSize = null;
      state.error = null;
    },
    // Set selected size
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    // Reset error
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        // Set default selected size to first size if product has sizes
        if (action.payload?.hasSizes && action.payload?.sizes?.length > 0) {
          state.selectedSize = action.payload.sizes[0];
        } else {
          state.selectedSize = null;
        }
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product details';
        state.currentProduct = null;
      })
      
      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        console.error('Failed to fetch related products:', action.payload);
        state.relatedProducts = [];
      });
  },
});

export const { clearProductDetails, setSelectedSize, resetError } = productDetailSlice.actions;
export default productDetailSlice.reducer;
