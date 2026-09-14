import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  type UserHistoryRow,
} from "../slices/userHistorySlice";
import {
  profileService,
  type CustomerHistoryItem,
} from "../../services/supabase/profileService";

function* handleFetchUsers(): Generator<unknown, void, CustomerHistoryItem[]> {
  try {
    const customers = yield call(profileService.fetchCustomerList);

    const formattedUsers: UserHistoryRow[] = customers.map(
      (cust: CustomerHistoryItem, index: number) => ({
        index: index + 1,
        uuid: cust.uuid,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        gender: "Customer",
        country: "Pakistan",
        thumbnail: `https://images.unsplash.com/photo-${1534528741775 + (index % 5) * 1000}?w=150&q=80&auto=format&fit=crop`,
      }),
    );

    yield put(fetchUsersSuccess(formattedUsers));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load customer list";
    yield put(fetchUsersFailure(message));
  }
}

export function* watchUserHistory() {
  yield takeLatest(fetchUsersStart.type, handleFetchUsers);
}
