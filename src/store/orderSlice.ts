// src/store/orderSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  customerName: string;
  boxSize: string;
  contents: string;
  totalPrice: number;
  status: 'Pending' | 'Baking' | 'Dispatched' | 'Delivered';
  timestamp: string;
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [ ]
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeNewOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload)
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    }
  }
});

export const { placeNewOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;