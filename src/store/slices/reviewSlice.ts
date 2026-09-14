import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Review, ReviewInput } from "../../types/review";

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    fetchReviewsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchReviewsSuccess(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchReviewsFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error = action.payload || "Failed to load reviews";
    },

    addReviewRequest(
      state,
      action: PayloadAction<{
        review: ReviewInput;
        user: { id: string; name: string; email: string };
      }>,
    ) {
      void action;
      state.loading = true;
    },
    addReviewSuccess(state, action: PayloadAction<Review>) {
      state.reviews.unshift(action.payload);
      state.loading = false;
    },
    addReviewFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  addReviewRequest,
  addReviewSuccess,
  addReviewFailure,
} = reviewSlice.actions;

// Backward-compatible alias
export const fetchReviewUsers = fetchReviewsRequest;

export default reviewSlice.reducer;