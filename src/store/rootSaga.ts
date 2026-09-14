import { all, fork } from "redux-saga/effects";
import { authSaga } from "./sagas/authSaga";
import { inventorySaga } from "./sagas/inventorySaga";
import { orderSaga } from "./sagas/orderSaga";
import { reviewSaga } from "./sagas/reviewSaga";
import { watchUserHistory } from "./sagas/userHistorySaga";
import { profileSaga } from "./sagas/profileSaga";
import { couponSaga } from "./sagas/couponSaga";
import { notificationSaga } from "./sagas/notificationSaga";
import { aiSaga } from "./sagas/aiSaga";

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(inventorySaga),
    fork(orderSaga),
    fork(reviewSaga),
    fork(watchUserHistory),
    fork(profileSaga),
    fork(couponSaga),
    fork(notificationSaga),
    fork(aiSaga),
  ]);
}
