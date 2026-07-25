import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'customer' | 'admin';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  isAuthModalOpen: boolean;
  isLoggedIn: boolean;
  user: UserProfile | null;
}

const initialState: AuthState = {
  isAuthModalOpen: false,
  isLoggedIn: false,
  user: null,
};

export const ADMIN_EMAIL = 'admin@exynoscooky.com';

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
      // Determine the role dynamically by evaluating the submitted email string
      const assignedRole: UserRole = 
        action.payload.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';

      state.isLoggedIn = true;
      state.user = {
        name: action.payload.name || (assignedRole === 'admin' ? 'System Administrator' : 'Valued Guest'),
        email: action.payload.email,
        role: assignedRole, // Save the role flag directly in the state tree
      };
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