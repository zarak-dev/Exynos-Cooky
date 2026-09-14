import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
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
} from "../slices/profileSlice";
import { updateUserProfile } from "../slices/authSlice";
import { addressService } from "../../services/supabase/addressService";
import { profileService } from "../../services/supabase/profileService";
import type { Address, AddressInput } from "../../types/address";
import type { UserProfile } from "../../types/auth";

function* handleFetchAddresses(
  action: PayloadAction<string>,
): Generator<unknown, void, Address[]> {
  try {
    const addresses = yield call(addressService.fetchAddresses, action.payload);
    yield put(fetchAddressesSuccess(addresses));
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to load addresses";
    yield put(fetchAddressesFailure(msg));
  }
}

function* handleAddAddress(
  action: PayloadAction<{ address: AddressInput; userId: string }>,
): Generator<unknown, void, Address> {
  try {
    const created = yield call(
      addressService.addAddress,
      action.payload.address,
      action.payload.userId,
    );
    yield put(addAddressSuccess(created));
  } catch (err) {
    console.warn("Error adding address:", err);
  }
}

function* handleDeleteAddress(action: PayloadAction<string>): Generator {
  try {
    yield call(addressService.deleteAddress, action.payload);
    yield put(deleteAddressSuccess(action.payload));
  } catch (err) {
    console.warn("Error deleting address:", err);
  }
}

function* handleSetDefaultAddress(
  action: PayloadAction<{ id: string; userId: string }>,
): Generator<unknown, void, Address[]> {
  try {
    const updated = yield call(
      addressService.setDefaultAddress,
      action.payload.id,
      action.payload.userId,
    );
    yield put(setDefaultAddressSuccess(updated));
  } catch (err) {
    console.warn("Error setting default address:", err);
  }
}

function* handleUpdateProfile(
  action: PayloadAction<{ userId: string; updates: Partial<UserProfile> }>,
): Generator<unknown, void, UserProfile> {
  try {
    const updated = yield call(
      profileService.updateProfile,
      action.payload.userId,
      action.payload.updates,
    );
    yield put(updateUserProfile(updated));
  } catch (err) {
    console.warn("Error updating profile:", err);
  }
}

export function* profileSaga() {
  yield takeLatest(fetchAddressesRequest.type, handleFetchAddresses);
  yield takeLatest(addAddressRequest.type, handleAddAddress);
  yield takeLatest(deleteAddressRequest.type, handleDeleteAddress);
  yield takeLatest(setDefaultAddressRequest.type, handleSetDefaultAddress);
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile);
}
