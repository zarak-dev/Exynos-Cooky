import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Address, AddressInput } from "../../types/address";
import type { UserProfile } from "../../types/auth";

interface ProfileState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  addresses: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchAddressesRequest: (state, action: PayloadAction<string>) => {
      void action;
      state.loading = true;
      state.error = null;
    },
    fetchAddressesSuccess: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      state.loading = false;
    },
    fetchAddressesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    addAddressRequest: (
      _state,
      action: PayloadAction<{ address: AddressInput; userId: string }>,
    ) => {
      void action;
    },
    addAddressSuccess: (state, action: PayloadAction<Address>) => {
      if (action.payload.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
      }
      state.addresses.unshift(action.payload);
    },

    deleteAddressRequest: (_state, action: PayloadAction<string>) => {
      void action;
    },
    deleteAddressSuccess: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    },

    setDefaultAddressRequest: (
      _state,
      action: PayloadAction<{ id: string; userId: string }>,
    ) => {
      void action;
    },
    setDefaultAddressSuccess: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },

    updateProfileRequest: (
      _state,
      action: PayloadAction<{ userId: string; updates: Partial<UserProfile> }>,
    ) => {
      void action;
    },
  },
});

export const {
  fetchAddressesRequest,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  addAddressRequest,
  addAddressSuccess,
  deleteAddressRequest,
  deleteAddressSuccess,
  setDefaultAddressRequest,
  setDefaultAddressSuccess,
  updateProfileRequest,
} = profileSlice.actions;

export default profileSlice.reducer;
