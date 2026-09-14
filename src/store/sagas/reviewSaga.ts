import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  addReviewRequest,
  addReviewSuccess,
  addReviewFailure,
} from "../slices/reviewSlice";
import { reviewService } from "../../services/supabase/reviewService";
import type { Review, ReviewInput } from "../../types/review";

function* handleFetchReviews(): Generator<unknown, void, Review[]> {
  try {
    const reviews = yield call(reviewService.fetchReviews);
    yield put(fetchReviewsSuccess(reviews));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch reviews";
    yield put(fetchReviewsFailure(message));
  }
}

function* handleAddReview(
  action: PayloadAction<{
    review: ReviewInput;
    user: { id: string; name: string; email: string };
  }>,
): Generator<unknown, void, Review> {
  try {
    const created = yield call(
      reviewService.addReview,
      action.payload.review,
      action.payload.user,
    );
    yield put(addReviewSuccess(created));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to submit review";
    yield put(addReviewFailure(message));
  }
}

export function* reviewSaga() {
  yield takeLatest(fetchReviewsRequest.type, handleFetchReviews);
  yield takeLatest(addReviewRequest.type, handleAddReview);
}
