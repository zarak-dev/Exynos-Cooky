import { call, put, takeEvery} from 'redux-saga/effects'


const fetchUserData = () => fetch('https://randomuser.me/api/').then((res) => res.json());
function* fetchUser(): Generator<any, void, any> {

    try {
      const user = yield call(fetchUserData)
      console.log(user)
      yield put ({ type: 'USER_FETCHED_SUCCEEDED', user: user})
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message: 'unknown Error';
      yield put({ type: 'FETCH_USER_FAILED', message: errorMessage})
      console.log(errorMessage)
    }
}

function* mySaga () {
  yield takeEvery('USER_FETCHED_REQUESTED', fetchUser)
};

// function* mySaga () {
//   yield takeLatest('USER_FETCHED_REQUESTED', fetchUser)
// }

export default mySaga;