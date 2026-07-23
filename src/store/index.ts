// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// 1. Import Reducers
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import inventoryReducer from './inventorySlice';
import orderReducer from './orderSlice';
import userHistoryReducer from './userHistorySlice'; // 🌟 Your new reducer

// 2. Import Sagas
import { watchUserHistory } from './sagas/userHistorySaga'; // 🌟 Your new saga

// 3. Centralized Root Saga
// As you add more features, just add their watchers here
function* rootSaga() {
  yield all([
    fork(watchUserHistory),
  ]);
}

// 4. Initialize Middleware
const sagaMiddleware = createSagaMiddleware();

// 5. Configure Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    userHistory: userHistoryReducer,
  },
  // Disable default thunk middleware if you are strictly using sagas, 
  // and concatenate your saga middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 6. Run the Root Saga
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;