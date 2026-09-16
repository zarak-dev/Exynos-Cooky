import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
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
} from "@src/store/slices/authSlice";
import { authService } from "@src/services/supabase/authService";
import type { UserProfile } from "@src/types/auth";

function* handleLogin(
  action: PayloadAction<{ email: string; password?: string; name?: string }>,
): Generator<unknown, void, UserProfile> {
  try {
    const user = yield call(
      authService.signIn,
      action.payload.email,
      action.payload.password,
    );
    yield put(loginSuccess(user));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    yield put(loginFailure(message));
  }
}

function* handleSignup(
  action: PayloadAction<{ email: string; password?: string; name: string }>,
): Generator<unknown, void, UserProfile> {
  try {
    const user = yield call(
      authService.signUp,
      action.payload.email,
      action.payload.password,
      action.payload.name,
    );
    yield put(signupSuccess(user));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register";
    yield put(signupFailure(message));
  }
}

function* handleRestoreSession(): Generator<unknown, void, UserProfile | null> {
  try {
    const user = yield call(authService.restoreSession);
    yield put(restoreSessionSuccess(user));
  } catch {
    yield put(restoreSessionSuccess(null));
  }
}

function* handleLoginOAuth(
  action: PayloadAction<{ provider: "google" | "github" }>,
): Generator {
  try {
    yield call(authService.signInWithOAuth, action.payload.provider);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to initiate OAuth login";
    yield put(loginFailure(message));
  }
}

function* handleLogout(): Generator {
  try {
    yield call(authService.signOut);
  } catch (err) {
    console.warn("Error signing out:", err);
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(loginOAuthRequest.type, handleLoginOAuth);
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(restoreSessionRequest.type, handleRestoreSession);
  yield takeLatest(logoutUser.type, handleLogout);
}
