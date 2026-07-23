import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  index: number;
  uuid: string;
  name: string;
  email: string;
  country: string;
  thumbnail: string;
}

interface UserHistoryState {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: UserHistoryState = {
  users: [],
  loading: false,
  error: null,
};

const userHistorySlice = createSlice({
  name: 'userHistory',
  initialState,
  reducers: {
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<UserProfile[]>) {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } = userHistorySlice.actions;
export default userHistorySlice.reducer;