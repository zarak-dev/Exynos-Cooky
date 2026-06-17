// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

// Strictly type hooks for seamless autocomplete inside components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;