import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "../../types/order";
import { loadFromStorage } from "../../utils/storage";

export type { Order };

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: loadFromStorage<Order[]>("exynos_orders", []),
  loading: false,
  error: null,
  currentOrder: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersRequest: (
      state,
      action: PayloadAction<{ userEmail?: string } | undefined>,
    ) => {
      void action;
      state.loading = true;
      state.error = null;
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

    createOrderRequest: (_state, action: PayloadAction<Order>) => {
      void action;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    updateOrderStatusRequest: (
      _state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      void action;
    },

    // Synchronous compatibility
    placeNewOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>,
    ) => {
      const order = state.orders.find((order) => order.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },

    deleteOrderRequest: (_state, action: PayloadAction<string>) => {
      void action;
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
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
  updateOrderStatusRequest,
  placeNewOrder,
  updateOrderStatus,
  deleteOrderRequest,
  deleteOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
