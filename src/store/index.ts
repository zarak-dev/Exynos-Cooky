import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

// Import Reducers
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import inventoryReducer from "./slices/inventorySlice";
import orderReducer from "./slices/orderSlice";
import userHistoryReducer from "./slices/userHistorySlice";
import reviewReducer from "./slices/reviewSlice";
import profileReducer from "./slices/profileSlice";
import couponReducer from "./slices/couponSlice";
import aiReducer from "./slices/aiSlice";

// Import Centralized Root Saga
import { rootSaga } from "./rootSaga";

// Initialize Middleware
const sagaMiddleware = createSagaMiddleware();

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    userHistory: userHistoryReducer,
    reviews: reviewReducer,
    profile: profileReducer,
    coupons: couponReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Run Root Saga
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
