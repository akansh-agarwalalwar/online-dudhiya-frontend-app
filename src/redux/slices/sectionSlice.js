import { createSlice } from '@reduxjs/toolkit';
import { fetchSections, fetchSectionById } from '../thunks/sectionThunk';

/**
 * Initial state for sections
 */
const initialState = {
    // All sections data
    sections: [],
    totalCount: 0,

    // Loading states
    loading: false,
    refreshing: false,
    loadingMore: false,

    // Error states
    error: null,

    // Pagination
    currentPage: 0,
    hasMore: true,

    // Single section details
    selectedSection: null,
    selectedSectionLoading: false,
    selectedSectionError: null,

    // Filters
    searchTerm: '',

    // Last fetch timestamp for cache invalidation
    lastFetch: null,
};

/**
 * Section Slice
 * Manages all section-related state
 */
const sectionSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        /**
         * Reset sections state
         */
        resetSections: (state) => {
            state.sections = [];
            state.totalCount = 0;
            state.currentPage = 0;
            state.hasMore = true;
            state.error = null;
            state.lastFetch = null;
        },

        /**
         * Set search term
         */
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            // Reset pagination when search term changes
            state.currentPage = 0;
            state.sections = [];
            state.hasMore = true;
        },

        /**
         * Clear error
         */
        clearError: (state) => {
            state.error = null;
        },

        /**
         * Clear selected section
         */
        clearSelectedSection: (state) => {
            state.selectedSection = null;
            state.selectedSectionError = null;
        },

        /**
         * Update section in list
         */
        updateSectionInList: (state, action) => {
            const index = state.sections.findIndex(
                (section) => section.id === action.payload.id
            );
            if (index !== -1) {
                state.sections[index] = {
                    ...state.sections[index],
                    ...action.payload,
                };
                
                // Re-sort sections after update in case sequence was changed
                state.sections = state.sections.sort((a, b) => {
                    const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
                    const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
                    return seqA - seqB;
                });
            }
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetch Sections - Pending
            .addCase(fetchSections.pending, (state, action) => {
                const isRefresh = action.meta.arg?.refresh;
                const isLoadMore = action.meta.arg?.loadMore;

                if (isRefresh) {
                    state.refreshing = true;
                } else if (isLoadMore) {
                    state.loadingMore = true;
                } else {
                    state.loading = true;
                }
                state.error = null;
            })

            // Fetch Sections - Fulfilled
            .addCase(fetchSections.fulfilled, (state, action) => {
                const { sections, total_count } = action.payload;
                const isRefresh = action.meta.arg?.refresh;
                const isLoadMore = action.meta.arg?.loadMore;

                // Sort sections by sequence before storing them
                const sortedSections = sections.sort((a, b) => {
                    // Handle cases where sequence might be null or undefined
                    const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
                    const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
                    return seqA - seqB;
                });

                if (isRefresh || !isLoadMore) {
                    // Replace sections on refresh or initial load
                    state.sections = sortedSections;
                    state.currentPage = 0;
                } else {
                    // Append sections on load more and re-sort the entire list
                    const allSections = [...state.sections, ...sortedSections];
                    state.sections = allSections.sort((a, b) => {
                        const seqA = a.sequence ?? Number.MAX_SAFE_INTEGER;
                        const seqB = b.sequence ?? Number.MAX_SAFE_INTEGER;
                        return seqA - seqB;
                    });
                }

                state.totalCount = total_count;
                state.hasMore = state.sections.length < total_count;
                state.loading = false;
                state.refreshing = false;
                state.loadingMore = false;
                state.error = null;
                state.lastFetch = Date.now();

                if (isLoadMore) {
                    state.currentPage += 1;
                }
            })

            // Fetch Sections - Rejected
            .addCase(fetchSections.rejected, (state, action) => {
                state.loading = false;
                state.refreshing = false;
                state.loadingMore = false;
                state.error = action.payload || 'Failed to fetch sections';
            })

            // Fetch Section By ID - Pending
            .addCase(fetchSectionById.pending, (state) => {
                state.selectedSectionLoading = true;
                state.selectedSectionError = null;
            })

            // Fetch Section By ID - Fulfilled
            .addCase(fetchSectionById.fulfilled, (state, action) => {
                state.selectedSection = action.payload;
                state.selectedSectionLoading = false;
                state.selectedSectionError = null;
            })

            // Fetch Section By ID - Rejected
            .addCase(fetchSectionById.rejected, (state, action) => {
                state.selectedSectionLoading = false;
                state.selectedSectionError = action.payload || 'Failed to fetch section details';
            });
    },
});

// Export actions
export const {
    resetSections,
    setSearchTerm,
    clearError,
    clearSelectedSection,
    updateSectionInList,
} = sectionSlice.actions;

// Export selectors
export const selectSections = (state) => state.sections.sections;
export const selectSectionsLoading = (state) => state.sections.loading;
export const selectSectionsError = (state) => state.sections.error;
export const selectSectionsRefreshing = (state) => state.sections.refreshing;
export const selectSectionsLoadingMore = (state) => state.sections.loadingMore;
export const selectHasMoreSections = (state) => state.sections.hasMore;
export const selectTotalSectionsCount = (state) => state.sections.totalCount;
export const selectSelectedSection = (state) => state.sections.selectedSection;
export const selectSelectedSectionLoading = (state) => state.sections.selectedSectionLoading;
export const selectSearchTerm = (state) => state.sections.searchTerm;

// Export reducer
export default sectionSlice.reducer;
