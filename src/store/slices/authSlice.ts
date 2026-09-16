import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile, UserRole } from "@src/types/auth";

export type { UserProfile, UserRole };

interface AuthState {
  isAuthModalOpen: boolean;
  isLoggedIn: boolean;
  isRestoringSession: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthModalOpen: false,
  isLoggedIn: false,
  isRestoringSession: true,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOpenAuthModal: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
      state.error = null;
    },

    // Saga Triggers
    loginRequest: (
      state,
      action: PayloadAction<{ email: string; password?: string; name?: string }>,
    ) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    loginOAuthRequest: (
      state,
      action: PayloadAction<{ provider: "google" | "github" }>,
    ) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.loading = false;
      state.isRestoringSession = false;
      state.error = null;
      state.isAuthModalOpen = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isRestoringSession = false;
      state.error = action.payload;
    },

    signupRequest: (
      state,
      action: PayloadAction<{ email: string; password?: string; name: string }>,
    ) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.loading = false;
      state.isRestoringSession = false;
      state.error = null;
      state.isAuthModalOpen = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isRestoringSession = false;
      state.error = action.payload;
    },

    restoreSessionRequest: (state) => {
      state.loading = true;
      state.isRestoringSession = true;
    },
    restoreSessionSuccess: (state, action: PayloadAction<UserProfile | null>) => {
      state.loading = false;
      state.isRestoringSession = false;
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
    },

    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      state.isRestoringSession = false;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          // Preserve foundational identity if payload omitted them
          id: action.payload.id || state.user.id,
          email: action.payload.email || state.user.email,
          role: action.payload.role || state.user.role,
        };
      }
    },
  },
});

export const {
  setOpenAuthModal,
  loginRequest,
  loginOAuthRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
  logoutUser,
  updateUserProfile,
} = authSlice.actions;

export const logoutRequest = logoutUser;

export default authSlice.reducer;
