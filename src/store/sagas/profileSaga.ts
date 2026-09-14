import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
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
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to add address";
    yield put(addAddressFailure(msg));
  }
}

function* handleDeleteAddress(
  action: PayloadAction<string>,
): Generator<unknown, void, string> {
  try {
    yield call(addressService.deleteAddress, action.payload);
    yield put(deleteAddressSuccess(action.payload));
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to delete address";
    yield put(deleteAddressFailure(msg));
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
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to set default address";
    yield put(setDefaultAddressFailure(msg));
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
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to update profile";
    yield put(updateProfileFailure(msg));
  }
}

export function* profileSaga() {
  yield takeLatest(fetchAddressesRequest.type, handleFetchAddresses);
  yield takeLatest(addAddressRequest.type, handleAddAddress);
  yield takeLatest(deleteAddressRequest.type, handleDeleteAddress);
  yield takeLatest(setDefaultAddressRequest.type, handleSetDefaultAddress);
  yield takeLatest(updateProfileRequest.type, handleUpdateProfile);
}
