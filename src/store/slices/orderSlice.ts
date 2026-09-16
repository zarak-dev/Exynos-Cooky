import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "@src/types/order";

export type { Order };

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  trackedOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
  trackedOrder: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersRequest: {
      reducer: (
        state,
        action: PayloadAction<{ userEmail?: string } | undefined>,
      ) => {
        void action;
        state.loading = true;
        state.error = null;
      },
      prepare: (payload?: { userEmail?: string }) => ({
        payload,
      }),
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createOrderRequest: (state, action: PayloadAction<Order>) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },

    trackOrderRequest: (state, action: PayloadAction<string>) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    trackOrderSuccess: (state, action: PayloadAction<Order | null>) => {
      state.trackedOrder = action.payload;
      state.loading = false;
      state.error = null;
    },
    trackOrderFailure: (state, action: PayloadAction<string>) => {
      state.trackedOrder = null;
      state.loading = false;
      state.error = action.payload;
    },

    updateOrderStatusRequest: (
      _state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      void action;
    },
    updateOrderStatusSuccess: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      const order = state.orders.find((order) => order.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.trackedOrder && state.trackedOrder.id === action.payload.id) {
        state.trackedOrder.status = action.payload.status;
      }
      state.error = null;
    },
    updateOrderStatusFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    deleteOrderRequest: (_state, action: PayloadAction<string>) => {
      void action;
    },
    deleteOrderSuccess: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
      if (state.trackedOrder && state.trackedOrder.id === action.payload) {
        state.trackedOrder = null;
      }
      state.error = null;
    },
    deleteOrderFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  clearCurrentOrder,
  trackOrderRequest,
  trackOrderSuccess,
  trackOrderFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
} = orderSlice.actions;

// Clean alias for realtime event dispatch
export const updateOrderStatus = updateOrderStatusSuccess;

export default orderSlice.reducer;
