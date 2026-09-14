import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

interface InventoryState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    fetchInventoryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchInventoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    toggleAvailabilityRequest: (
      _state,
      action: PayloadAction<{ id: number; isAvailable: boolean }>,
    ) => {
      void action;
    },
    toggleAvailabilitySuccess: (
      state,
      action: PayloadAction<{ id: number; isAvailable: boolean }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.isAvailable = action.payload.isAvailable;
      }
      state.error = null;
    },
    toggleAvailabilityFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    addProductRequest: (
      _state,
      action: PayloadAction<Omit<Product, "id">>,
    ) => {
      void action;
    },
    addProductSuccess: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
      state.error = null;
    },
    addProductFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    updateProductRequest: (
      _state,
      action: PayloadAction<{ id: number; updates: Partial<Product> }>,
    ) => {
      void action;
    },
    updateProductSuccess: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.error = null;
    },
    updateProductFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    deleteProductRequest: (_state, action: PayloadAction<number>) => {
      void action;
    },
    deleteProductSuccess: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.error = null;
    },
    deleteProductFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Synchronous action compatibility
    toggleItemAvailability: (
      state,
      action: PayloadAction<{ id: number; isAvailable: boolean }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.isAvailable = action.payload.isAvailable;
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  toggleAvailabilityRequest,
  toggleAvailabilitySuccess,
  toggleAvailabilityFailure,
  addProductRequest,
  addProductSuccess,
  addProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
  toggleItemAvailability,
  deleteItem,
} = inventorySlice.actions;

export default inventorySlice.reducer;
