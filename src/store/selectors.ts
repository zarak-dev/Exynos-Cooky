import { createSelector } from "@reduxjs/toolkit";

import { initialState } from "./cartSlice";

const selectInitialState = (state: any) => state.cart || initialState;

export const selectCartData = createSelector(
  [selectInitialState],
  (state) => state,
);

export const isCartAvailable = createSelector (
  [selectInitialState],
  (state) => state.isCartOpen,
)
