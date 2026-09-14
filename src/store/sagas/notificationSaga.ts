import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  markNotificationAsRead,
} from "../slices/notificationSlice";
import { notificationService } from "../../services/supabase/notificationService";
import type { AppNotification } from "../../types/notification";

function* handleFetchNotifications(
  action: PayloadAction<string>,
): Generator<unknown, void, AppNotification[]> {
  try {
    const list = yield call(
      notificationService.fetchNotifications,
      action.payload,
    );
    yield put(fetchNotificationsSuccess(list));
  } catch (err) {
    console.warn("Notice loading notifications:", err);
  }
}

function* handleMarkRead(action: PayloadAction<string>): Generator {
  try {
    yield call(notificationService.markAsRead, action.payload);
  } catch (err) {
    console.warn("Notice marking notification read:", err);
  }
}

export function* notificationSaga() {
  yield takeLatest(fetchNotificationsRequest.type, handleFetchNotifications);
  yield takeLatest(markNotificationAsRead.type, handleMarkRead);
}
