import { createAsyncThunk } from '@reduxjs/toolkit';
import sectionService from '../../services/SectionService';

/**
 * Fetch all sections with pagination and search
 * @param {Object} params
 * @param {number} params.offset - Pagination offset
 * @param {number} params.limit - Number of items per page
 * @param {string} params.search_term - Search term
 * @param {boolean} params.refresh - Whether this is a refresh action
 * @param {boolean} params.loadMore - Whether this is a load more action
 */
export const fetchSections = createAsyncThunk(
    'sections/fetchSections',
    async (params = {}, { rejectWithValue, getState }) => {
        try {
            const { sections } = getState();

            // Determine offset based on current state
            let offset = params.offset;
            if (params.loadMore) {
                offset = sections.sections.length;
            } else if (params.refresh) {
                offset = 0;
            }

            const queryParams = {
                offset: offset || 0,
                limit: params.limit || 20,
                search_term: params.search_term || sections.searchTerm || '',
            };

            const response = await sectionService.getAllSections(queryParams);

            if (!response.success) {
                return rejectWithValue(response.data?.message || 'Failed to fetch sections');
            }
            

            // Transform the data
            const transformedSections = sectionService.transformSectionsData(
                response.data.data?.sections || []
            );

            return {
                sections: transformedSections,
                total_count: response.data.data?.total_count || 0,
            };
        } catch (error) {
            console.error('Error in fetchSections thunk:', error);
            return rejectWithValue(
                error.message || error.data?.message || 'Failed to fetch sections'
            );
        }
    }
);

/**
 * Fetch section by ID
 * @param {string} sectionId - Section ID
 */
export const fetchSectionById = createAsyncThunk(
    'sections/fetchSectionById',
    async (sectionId, { rejectWithValue }) => {
        try {
            if (!sectionId) {
                return rejectWithValue('Section ID is required');
            }

            const response = await sectionService.getSectionById(sectionId);

            if (!response.success) {
                return rejectWithValue(response.data?.message || 'Failed to fetch section');
            }

            // Transform the data
            const section = response.data.data?.section;
            if (!section) {
                return rejectWithValue('Section not found');
            }

            const transformedSection = {
                id: section.id,
                title: section.name,
                sectionImage: section.imageUrl,
                showSectionImage: !!section.imageUrl,
                seeAllFilter: section.see_all_filter,
                isHidden: section.isHidden,
                sequence: section.sequence,
                createdAt: section.createdAt,
                updatedAt: section.updatedAt,
                products: sectionService.transformMedicinesData(section.medicines || []),
            };

            return transformedSection;
        } catch (error) {
            console.error('Error in fetchSectionById thunk:', error);
            return rejectWithValue(
                error.message || error.data?.message || 'Failed to fetch section details'
            );
        }
    }
);

/**
 * Refresh sections (pull to refresh)
 */
export const refreshSections = createAsyncThunk(
    'sections/refreshSections',
    async (params = {}, { dispatch }) => {
        return dispatch(
            fetchSections({
                ...params,
                refresh: true,
                offset: 0,
            })
        ).unwrap();
    }
);

/**
 * Load more sections (pagination)
 */
export const loadMoreSections = createAsyncThunk(
    'sections/loadMoreSections',
    async (params = {}, { dispatch, getState }) => {
        const { sections } = getState();

        if (!sections.hasMore || sections.loadingMore) {
            return Promise.resolve();
        }

        return dispatch(
            fetchSections({
                ...params,
                loadMore: true,
            })
        ).unwrap();
    }
);

/**
 * Search sections
 * @param {string} searchTerm - Search term
 */
export const searchSections = createAsyncThunk(
    'sections/searchSections',
    async (searchTerm, { dispatch }) => {
        return dispatch(
            fetchSections({
                search_term: searchTerm,
                offset: 0,
                limit: 20,
            })
        ).unwrap();
    }
);
