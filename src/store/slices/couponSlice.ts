import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coupon, CouponValidationResult } from "../../types/coupon";

interface CouponState {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  appliedCoupon: null,
  discountAmount: 0,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    applyCouponRequest: (
      state,
      action: PayloadAction<{ code: string; subtotal: number }>,
    ) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    applyCouponSuccess: (
      state,
      action: PayloadAction<CouponValidationResult>,
    ) => {
      state.appliedCoupon = action.payload.coupon || null;
      state.discountAmount = action.payload.discountAmount;
      state.loading = false;
      state.error = null;
    },
    applyCouponFailure: (state, action: PayloadAction<string>) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.loading = false;
      state.error = action.payload;
    },
    clearCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.error = null;
    },
  },
});

export const {
  applyCouponRequest,
  applyCouponSuccess,
  applyCouponFailure,
  clearCoupon,
} = couponSlice.actions;

export default couponSlice.reducer;
