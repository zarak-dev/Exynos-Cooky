import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  customerName: string;
  boxSize: string;
  contents: string;
  totalPrice: number;
  status: "Pending" | "Baking" | "Dispatched" | "Delivered";
  timestamp: string;
}
const loadOrdersFromStorage = (): Order[] => {
  try {
    const saved = localStorage.getItem("exynos_orders");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: loadOrdersFromStorage(),
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeNewOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      localStorage.setItem("exynos_orders", JSON.stringify(state.orders));
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>,
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        localStorage.setItem("exynos_orders", JSON.stringify(state.orders));
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
    },
  },
});

export const { placeNewOrder, updateOrderStatus, deleteOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
