import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";
import { COOKIE_MOCK_DATA } from "../../utils/mockData";
import { loadFromStorage } from "../../utils/storage";

interface InventoryState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: loadFromStorage<Product[]>("exynos_inventory", COOKIE_MOCK_DATA),
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

    // Synchronous action compatibility + optimistic update
    toggleItemAvailability: (
      state,
      action: PayloadAction<{ id: number; isAvailable: boolean }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.isAvailable = action.payload.isAvailable;
      }
    },

    addProductRequest: (
      _state,
      action: PayloadAction<Omit<Product, "id">>,
    ) => {
      void action;
    },
    addProductSuccess: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
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
    },

    deleteProductRequest: (_state, action: PayloadAction<number>) => {
      void action;
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
  toggleItemAvailability,
  addProductRequest,
  addProductSuccess,
  updateProductRequest,
  updateProductSuccess,
  deleteProductRequest,
  deleteItem,
} = inventorySlice.actions;

export default inventorySlice.reducer;
