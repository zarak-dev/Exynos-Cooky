import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { COOKIE_MOCK_DATA } from '../../utils/mockData';

interface CookieItem {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  description: string;
}

const loadInventoryFromStorage = () => {
  try {
    const savedInventory = localStorage.getItem('exynos_inventory');
    return savedInventory ? JSON.parse(savedInventory) : COOKIE_MOCK_DATA;
  } catch (error) {
    return COOKIE_MOCK_DATA;
  }
};

interface InventoryState {
  items: CookieItem[];
}

const initialState: InventoryState = {
  items: loadInventoryFromStorage(),
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // This action handles toggling availability across the entire app
    toggleItemAvailability: (state, action: PayloadAction<{ id: number; isAvailable: boolean }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.isAvailable = action.payload.isAvailable;
        localStorage.setItem('exynos_inventory', JSON.stringify(state.items));
      }
    },
  },
});

export const { toggleItemAvailability } = inventorySlice.actions;
export default inventorySlice.reducer;