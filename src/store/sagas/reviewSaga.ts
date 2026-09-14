import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchReviewUsers,
  fetchReviewUsersSuccess,
  fetchReviewUsersFailure,
  addReviewRequest,
  addReviewSuccess,
  addReviewFailure,
  type ReviewUser,
} from "../slices/reviewSlice";
import { reviewService } from "../../services/supabase/reviewService";
import type { Review, ReviewInput } from "../../types/review";

function* handleFetchReviewUsers(): Generator<unknown, void, Review[]> {
  try {
    const reviews = yield call(reviewService.fetchReviews);
    const users: ReviewUser[] = reviews.map((rev) => ({
      name: rev.userName,
      avatar:
        rev.userAvatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&auto=format&fit=crop",
      email: rev.userEmail || "",
      comment: rev.comment,
      rating: rev.rating,
    }));
    yield put(fetchReviewUsersSuccess({ users, reviews }));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch reviews";
    yield put(fetchReviewUsersFailure(message));
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
  yield takeLatest(fetchReviewUsers.type, handleFetchReviewUsers);
  yield takeLatest(addReviewRequest.type, handleAddReview);
}
