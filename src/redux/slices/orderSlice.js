import { createSlice } from '@reduxjs/toolkit';
import {
    createProductOrder,
    getOrderById,
    getCustomerOrders,
    cancelOrder,
} from '../thunks/orderThunk';

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    totalCount: 0,
    orderCreating: false,
    orderCreated: false,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.orderCreated = false;
        },
        clearOrderError: (state) => {
            state.error = null;
        },
        resetOrderState: () => initialState,
    },
    extraReducers: (builder) => {
        // Create Product Order
        builder
            .addCase(createProductOrder.pending, (state) => {
                state.orderCreating = true;
                state.orderCreated = false;
                state.error = null;
            })
            .addCase(createProductOrder.fulfilled, (state, action) => {
                state.orderCreating = false;
                state.orderCreated = true;
                state.currentOrder = action.payload;
            })
            .addCase(createProductOrder.rejected, (state, action) => {
                state.orderCreating = false;
                state.orderCreated = false;
                state.error = action.payload || 'Failed to create order';
            });

        // Get Order By ID
        builder
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch order';
            });

        // Get Customer Orders
        builder
            .addCase(getCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || [];
                state.totalCount = action.payload.total_count || 0;
            })
            .addCase(getCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch orders';
            });

        // Cancel Order
        builder
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Update the order in the list
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                // Update current order if it's the same
                if (state.currentOrder?.id === action.payload.id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to cancel order';
            });
    },
});

export const { clearCurrentOrder, clearOrderError, resetOrderState } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderCreating = (state) => state.order.orderCreating;
export const selectOrderCreated = (state) => state.order.orderCreated;
export const selectTotalOrderCount = (state) => state.order.totalCount;

export default orderSlice.reducer;
