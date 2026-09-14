import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile, UserRole } from "../../types/auth";
import { ADMIN_EMAIL } from "../../constants/roles";

export { ADMIN_EMAIL };
export type { UserProfile, UserRole };

export interface RegisteredUser {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

interface AuthState {
  isAuthModalOpen: boolean;
  isLoggedIn: boolean;
  user: UserProfile | null;
  registeredUsers: RegisteredUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthModalOpen: false,
  isLoggedIn: false,
  user: null,
  registeredUsers: [],
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
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthModalOpen = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
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
      state.error = null;
      state.isAuthModalOpen = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    restoreSessionRequest: (state) => {
      state.loading = true;
    },
    restoreSessionSuccess: (state, action: PayloadAction<UserProfile | null>) => {
      state.loading = false;
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload;
      }
    },

    // Synchronous action compatibility
    loginUser: (
      state,
      action: PayloadAction<{ name?: string; email: string; role?: UserRole }>,
    ) => {
      const assignedRole: UserRole =
        action.payload.role ||
        (action.payload.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? "admin"
          : "customer");

      state.isLoggedIn = true;
      state.user = {
        id: `user-${Date.now()}`,
        name:
          action.payload.name ||
          (assignedRole === "admin" ? "System Administrator" : "Valued Customer"),
        email: action.payload.email,
        role: assignedRole,
      };
      state.isAuthModalOpen = false;
    },

    registerUser: (state, action: PayloadAction<RegisteredUser>) => {
      state.registeredUsers.push(action.payload);
    },

    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setOpenAuthModal,
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
} = authSlice.actions;

export const logoutRequest = logoutUser;

export default authSlice.reducer;
