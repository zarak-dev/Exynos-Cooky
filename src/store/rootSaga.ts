import { all, fork } from "redux-saga/effects";
import { authSaga } from "./sagas/authSaga";
import { inventorySaga } from "./sagas/inventorySaga";
import { orderSaga } from "./sagas/orderSaga";
import { reviewSaga } from "./sagas/reviewSaga";
import { userHistorySaga } from "./sagas/userHistorySaga";
import { profileSaga } from "./sagas/profileSaga";
import { couponSaga } from "./sagas/couponSaga";
import { aiSaga } from "./sagas/aiSaga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(inventorySaga),
    fork(orderSaga),
    fork(reviewSaga),
    fork(userHistorySaga),
    fork(profileSaga),
    fork(couponSaga),
    fork(aiSaga),
  ]);
}
