import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Review, ReviewInput } from "../../types/review";

export interface ReviewUser {
  name: string;
  avatar: string;
  email: string;
  comment?: string;
  rating?: number;
}

interface ReviewState {
  users: ReviewUser[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  users: [],
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    fetchReviewUsers(state) {
      state.loading = true;
      state.error = null;
    },
    fetchReviewUsersSuccess(
      state,
      action: PayloadAction<{ users: ReviewUser[]; reviews: Review[] }>,
    ) {
      state.users = action.payload.users;
      state.reviews = action.payload.reviews;
      state.loading = false;
      state.error = null;
    },
    fetchReviewUsersFailure(state, action: PayloadAction<string | undefined>) {
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
      state.users.unshift({
        name: action.payload.userName,
        avatar: action.payload.userAvatar || "",
        email: action.payload.userEmail || "",
        comment: action.payload.comment,
        rating: action.payload.rating,
      });
      state.loading = false;
    },
    addReviewFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchReviewUsers,
  fetchReviewUsersSuccess,
  fetchReviewUsersFailure,
  addReviewRequest,
  addReviewSuccess,
  addReviewFailure,
} = reviewSlice.actions;

export default reviewSlice.reducer;