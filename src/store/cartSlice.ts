import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { type Cookie } from '../utils/mockData';

export type BoxSize = 4 | 6 | 12;

interface CartState {
  boxSize: BoxSize;
  items: Cookie[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  boxSize: 4,
  items: [],
  isCartOpen: false, 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setBoxSize: (state, action: PayloadAction<BoxSize>) => {
      state.boxSize = action.payload;
      if (state.items.length > action.payload) {
        state.items = state.items.slice(0, action.payload);
        message.info(`Box resized to ${action.payload}-Pack. Excess cookies removed.`);
      } else {
        message.info(`Box tier changed to ${action.payload}-Pack!`);
      }
    },
    addCookieToBox: (state, action: PayloadAction<Cookie>) => {
      if (state.items.length >= state.boxSize) {
        message.error(`Your ${state.boxSize}-Pack is full! Clear items or upgrade your box size.`);
        return;
      }
      state.items.push(action.payload);
      message.success(`Added ${action.payload.name} to your box! 🍪`);
    },
    removeCookieFromBox: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    clearBox: (state) => {
      state.items = [];
      message.info('Box cleared!');
    },
    // Added open/close actions for the drawer overlay layout
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    }
  }
});

export const { 
  setBoxSize, 
  addCookieToBox, 
  removeCookieFromBox, 
  clearBox, 
  toggleCart, 
  setCartOpen 
} = cartSlice.actions;

export default cartSlice.reducer;