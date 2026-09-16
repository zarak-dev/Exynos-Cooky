import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  trackOrderRequest,
  trackOrderSuccess,
  trackOrderFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
} from "@src/store/slices/orderSlice";
import { orderService } from "@src/services/supabase/orderService";
import type { Order, OrderStatus } from "@src/types/order";

function* handleFetchOrders(
  action?: PayloadAction<
    { userEmail?: string; userId?: string } | undefined
  >,
): Generator<unknown, void, Order[]> {
  try {
    const orders = yield call(
      orderService.fetchOrders,
      action?.payload,
    );
    yield put(fetchOrdersSuccess(orders));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load orders";
    yield put(fetchOrdersFailure(message));
  }
}

function* handleCreateOrder(
  action: PayloadAction<Order>,
): Generator<unknown, void, Order> {
  try {
    const newOrder = yield call(orderService.createOrder, action.payload);
    yield put(createOrderSuccess(newOrder));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to place order";
    yield put(createOrderFailure(message));
  }
}

function* handleTrackOrder(
  action: PayloadAction<string>,
): Generator<unknown, void, Order | null> {
  try {
    const foundOrder = yield call(orderService.trackOrder, action.payload);
    yield put(trackOrderSuccess(foundOrder));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to track order";
    yield put(trackOrderFailure(message));
  }
}

function* handleUpdateOrderStatus(
  action: PayloadAction<{ id: string; status: OrderStatus }>,
): Generator<unknown, void, { id: string; status: OrderStatus }> {
  try {
    const result = yield call(
      orderService.updateOrderStatus,
      action.payload.id,
      action.payload.status,
    );
    yield put(updateOrderStatusSuccess(result));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update order status";
    yield put(updateOrderStatusFailure(message));
  }
}

function* handleDeleteOrder(
  action: PayloadAction<string>,
): Generator<unknown, void, string> {
  try {
    const deletedId = yield call(orderService.deleteOrder, action.payload);
    yield put(deleteOrderSuccess(deletedId));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete order";
    yield put(deleteOrderFailure(message));
  }
}

export function* orderSaga() {
  yield takeLatest(fetchOrdersRequest.type, handleFetchOrders);
  yield takeLatest(createOrderRequest.type, handleCreateOrder);
  yield takeLatest(trackOrderRequest.type, handleTrackOrder);
  yield takeLatest(updateOrderStatusRequest.type, handleUpdateOrderStatus);
  yield takeLatest(deleteOrderRequest.type, handleDeleteOrder);
}
