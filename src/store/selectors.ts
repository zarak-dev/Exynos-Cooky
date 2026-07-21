import { type RootState } from './index';
import { initialState } from './cartSlice';

const selectInitialState = (state: RootState) => state.cart || initialState;
export const selectCartData = (state: RootState) => selectInitialState(state);
export const isCartAvailable = (state: RootState) => selectInitialState(state).isCartOpen;