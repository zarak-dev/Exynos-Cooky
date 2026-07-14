import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import createSagaMiddleware from 'redux-saga'
import authReducer from './authSlice';
import inventoryReducer from './inventorySlice';
import mySaga from './saga'
import orderReducer from './orderSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(mySaga)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;