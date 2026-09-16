import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Address, AddressInput } from "@src/types/address";
import type { UserProfile } from "@src/types/auth";

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
      state.error = null;
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
      state.error = null;
    },
    addAddressFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    deleteAddressRequest: (_state, action: PayloadAction<string>) => {
      void action;
    },
    deleteAddressSuccess: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      state.error = null;
    },
    deleteAddressFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setDefaultAddressRequest: (
      _state,
      action: PayloadAction<{ id: string; userId: string }>,
    ) => {
      void action;
    },
    setDefaultAddressSuccess: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      state.error = null;
    },
    setDefaultAddressFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    updateProfileRequest: (
      _state,
      action: PayloadAction<{ userId: string; updates: Partial<UserProfile> }>,
    ) => {
      void action;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  fetchAddressesRequest,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  addAddressRequest,
  addAddressSuccess,
  addAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,
  setDefaultAddressRequest,
  setDefaultAddressSuccess,
  setDefaultAddressFailure,
  updateProfileRequest,
  updateProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
