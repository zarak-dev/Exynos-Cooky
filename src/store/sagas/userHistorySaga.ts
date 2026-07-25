import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } from '../slices/userHistorySlice';

// API Call Function
const fetchUsersApi = async () => {
  // Using seed=exynos ensures we get the same "random" users every time for a stable demo
  const response = await fetch('https://randomuser.me/api/?results=100&seed=exynos');
  if (!response.ok) throw new Error('Failed to fetch user history');
  return response.json();
};

// Worker Saga
function* handleFetchUsers(): Generator<any, void, any> {
  try {
    const data = yield call(fetchUsersApi);
    
    // Transform the messy randomuser API response into our clean TypeScript interface
    const formattedUsers = data.results.map((user: any, index: number) => ({
      index: index + 1,
      uuid: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      country: user.location.country,
      thumbnail: user.picture.thumbnail,
    }));

    yield put(fetchUsersSuccess(formattedUsers));
  } catch (error: any) {
    yield put(fetchUsersFailure(error.message));
  }
}

// Watcher Saga
export function* watchUserHistory() {
  yield takeLatest(fetchUsersStart.type, handleFetchUsers);
}