import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import addressService from "../../services/addressService";

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getMe();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateMe(profileData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

// Address thunks
export const fetchAddresses = createAsyncThunk(
  "user/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch addresses");
    }
  }
);

export const createAddress = createAsyncThunk(
  "user/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(addressId, addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete address");
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "user/setDefaultAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await addressService.setDefaultAddress(addressId);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to set default address");
    }
  }
);

const initialState = {
  profile: null,
  preferences: {
    notifications: true,
    language: "en",
    theme: "light",
  },
  orders: [],
  addresses: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setUserPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    addAddressLocal: (state, action) => {
      state.addresses.push(action.payload);
    },
    updateAddressLocal: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    deleteAddressLocal: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        // If new address is default, unset all others
        if (action.payload.is_default) {
          state.addresses = state.addresses.map(addr => ({ ...addr, is_default: false }));
        }
        state.addresses.push(action.payload);
        state.error = null;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          // If updated address is default, unset all others
          if (action.payload.is_default) {
            state.addresses = state.addresses.map(addr => ({ ...addr, is_default: false }));
          }
          state.addresses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Unset all defaults first
        state.addresses = state.addresses.map(addr => ({ ...addr, is_default: false }));
        // Set the new default
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUserProfile,
  updateProfileLocal,
  setUserPreferences,
  addOrder,
  updateOrder,
  addAddressLocal,
  updateAddressLocal,
  deleteAddressLocal,
  setLoading,
  setError,
  clearError,
  clearUserData,
} = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserAddresses = (state) => state.user.addresses;
export const selectDefaultAddress = (state) =>
  state.user.addresses.find(addr => addr.is_default) || null;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;