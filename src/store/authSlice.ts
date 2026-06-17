import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthModalOpen: boolean;
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
}

const initialState: AuthState = {
  isAuthModalOpen: false,
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAuthModal: (state) => {
      state.isAuthModalOpen = !state.isAuthModalOpen;
    },
    setOpenAuthModal: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    loginUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isAuthModalOpen = false;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { toggleAuthModal, setOpenAuthModal, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;