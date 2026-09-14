import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  applyCouponRequest,
  applyCouponSuccess,
  applyCouponFailure,
} from "../slices/couponSlice";
import { couponService } from "../../services/supabase/couponService";
import type { CouponValidationResult } from "../../types/coupon";

function* handleApplyCoupon(
  action: PayloadAction<{ code: string; subtotal: number }>,
): Generator<unknown, void, CouponValidationResult> {
  try {
    const result = yield call(
      couponService.validateCoupon,
      action.payload.code,
      action.payload.subtotal,
    );
    if (result.isValid) {
      yield put(applyCouponSuccess(result));
    } else {
      yield put(applyCouponFailure(result.errorMessage || "Invalid coupon"));
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to apply coupon";
    yield put(applyCouponFailure(msg));
  }
}

export function* couponSaga() {
  yield takeLatest(applyCouponRequest.type, handleApplyCoupon);
}
