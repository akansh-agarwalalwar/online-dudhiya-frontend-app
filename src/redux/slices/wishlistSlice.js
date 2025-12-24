import { createSlice } from '@reduxjs/toolkit';
import {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    checkWishlistItem,
    fetchPopularItems,
} from '../thunks/wishlistThunk';

const initialState = {
    items: [],
    wishlistData: null,
    total: 0,
    popularItems: [],
    wishlistStatus: {}, // { medicineId: boolean }
    isLoading: false,
    isPopularLoading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },

        // Optimistic update for wishlist status
        setWishlistStatus: (state, action) => {
            const { medicineId, isInWishlist } = action.payload;
            state.wishlistStatus[medicineId] = isInWishlist;
        },

        clearWishlist: (state) => {
            state.items = [];
            state.wishlistData = null;
            state.total = 0;
            state.wishlistStatus = {};
        },
    },
    extraReducers: (builder) => {
        // Fetch Wishlist
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                const { wishlist = [], total = 0 } = action.payload || {};

                state.items = wishlist;
                state.total = total;
                state.wishlistData = action.payload;

                // Update wishlist status map
                wishlist.forEach((item) => {
                    if (item.medicineId) {
                        state.wishlistStatus[item.medicineId] = true;
                    }
                });

                state.error = null;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch wishlist';
            });

        // Add to Wishlist
        builder
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                const { wishlistItem } = action.payload || {};

                if (wishlistItem) {
                    // Add to items if not already present
                    const exists = state.items.find(item => item.id === wishlistItem.id);
                    if (!exists) {
                        state.items.unshift(wishlistItem);
                        state.total += 1;
                    }

                    // Update status
                    if (wishlistItem.medicineId) {
                        state.wishlistStatus[wishlistItem.medicineId] = true;
                    }
                }

                state.error = null;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to add to wishlist';
            });

        // Remove from Wishlist
        builder
            .addCase(removeFromWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                const { wishlistId } = action.payload;

                // Find and remove the item
                const itemIndex = state.items.findIndex(item => item.id === wishlistId);
                if (itemIndex !== -1) {
                    const medicineId = state.items[itemIndex].medicineId;
                    state.items.splice(itemIndex, 1);
                    state.total -= 1;

                    // Update status
                    if (medicineId) {
                        state.wishlistStatus[medicineId] = false;
                    }
                }

                state.error = null;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to remove from wishlist';
            });

        // Toggle Wishlist Item
        builder
            .addCase(toggleWishlistItem.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                const { medicineId, isInWishlist } = action.payload;

                // Update status
                state.wishlistStatus[medicineId] = isInWishlist;

                // If removed, update items array
                if (!isInWishlist) {
                    const itemIndex = state.items.findIndex(
                        item => item.medicineId === medicineId
                    );
                    if (itemIndex !== -1) {
                        state.items.splice(itemIndex, 1);
                        state.total -= 1;
                    }
                }

                state.error = null;
            })
            .addCase(toggleWishlistItem.rejected, (state, action) => {
                state.error = action.payload || 'Failed to toggle wishlist';
            });

        // Check Wishlist Item
        builder
            .addCase(checkWishlistItem.pending, (state) => {
                state.error = null;
            })
            .addCase(checkWishlistItem.fulfilled, (state, action) => {
                const { medicineId, isInWishlist } = action.payload;
                state.wishlistStatus[medicineId] = isInWishlist;
                state.error = null;
            })
            .addCase(checkWishlistItem.rejected, (state, action) => {
                state.error = action.payload || 'Failed to check wishlist';
            });

        // Fetch Popular Items
        builder
            .addCase(fetchPopularItems.pending, (state) => {
                state.isPopularLoading = true;
                state.error = null;
            })
            .addCase(fetchPopularItems.fulfilled, (state, action) => {
                state.isPopularLoading = false;
                const { medicines = [] } = action.payload || {};
                state.popularItems = medicines;
                state.error = null;
            })
            .addCase(fetchPopularItems.rejected, (state, action) => {
                state.isPopularLoading = false;
                state.error = action.payload || 'Failed to fetch popular items';
            });
    },
});

export const {
    clearWishlistError,
    setWishlistStatus,
    clearWishlist,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistTotal = (state) => state.wishlist.total;
export const selectWishlistLoading = (state) => state.wishlist.isLoading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectPopularItems = (state) => state.wishlist.popularItems;
export const selectPopularLoading = (state) => state.wishlist.isPopularLoading;

// Check if medicine is in wishlist
export const selectIsInWishlist = (state, medicineId) => {
    return state.wishlist.wishlistStatus[medicineId] || false;
};

// Get wishlist item by medicine ID
export const selectWishlistItemByMedicineId = (state, medicineId) => {
    return state.wishlist.items.find(item => item.medicineId === medicineId);
};

export default wishlistSlice.reducer;
