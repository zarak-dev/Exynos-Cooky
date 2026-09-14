import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Cookie } from "../../utils/mockData";
import { loadFromStorage } from "../../utils/storage";

export type BoxSize = 4 | 6 | 12;

interface SavedCart {
  boxSize: BoxSize;
  items: Cookie[];
}

const savedCart = loadFromStorage<SavedCart>("exynos_cart", {
  boxSize: 4,
  items: [],
});

interface CartState {
  boxSize: BoxSize;
  items: Cookie[];
  isCartOpen: boolean;
}

export const initialState: CartState = {
  boxSize: savedCart.boxSize || 4,
  items: savedCart.items || [],
  isCartOpen: false,
};

function persistCart(boxSize: BoxSize, items: Cookie[]) {
  try {
    localStorage.setItem("exynos_cart", JSON.stringify({ boxSize, items }));
  } catch {
    // Ignore quota
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setBoxSize: (state, action: PayloadAction<BoxSize>) => {
      state.boxSize = action.payload;
      // If shrinking the box, remove excess cookies
      if (state.items.length > action.payload) {
        state.items = state.items.slice(0, action.payload);
      }
      persistCart(state.boxSize, state.items);
    },
    addCookieToBox: (state, action: PayloadAction<Cookie>) => {
      const nextSize: Record<BoxSize, BoxSize | null> = {
        4: 6,
        6: 12,
        12: null,
      };

      if (state.items.length >= state.boxSize) {
        const upgraded = nextSize[state.boxSize];
        if (upgraded) {
          state.boxSize = upgraded;
        } else {
          return;
        }
      }

      state.items.push(action.payload);
      persistCart(state.boxSize, state.items);
    },
    removeCookieFromBox: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
      persistCart(state.boxSize, state.items);
    },
    clearBox: (state) => {
      state.items = [];
      try {
        localStorage.removeItem("exynos_cart");
      } catch {
        // Ignore
      }
    },
    // Added open/close actions for the drawer overlay layout
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  setBoxSize,
  addCookieToBox,
  removeCookieFromBox,
  clearBox,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
