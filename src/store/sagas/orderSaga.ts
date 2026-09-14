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
  updateOrderStatus,
  deleteOrderRequest,
  deleteOrder,
} from "../slices/orderSlice";
import { orderService } from "../../services/supabase/orderService";
import type { Order, OrderStatus } from "../../types/order";

function* handleFetchOrders(
  action?: PayloadAction<{ userEmail?: string } | undefined>,
): Generator<unknown, void, Order[]> {
  try {
    const orders = yield call(
      orderService.fetchOrders,
      action?.payload?.userEmail,
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
): Generator {
  try {
    yield put(updateOrderStatus(action.payload));
    yield call(
      orderService.updateOrderStatus,
      action.payload.id,
      action.payload.status,
    );
  } catch (err) {
    console.warn("Error updating order status:", err);
  }
}

function* handleDeleteOrder(action: PayloadAction<string>): Generator {
  try {
    yield put(deleteOrder(action.payload));
    yield call(orderService.deleteOrder, action.payload);
  } catch (err) {
    console.warn("Error deleting order:", err);
  }
}

export function* orderSaga() {
  yield takeLatest(fetchOrdersRequest.type, handleFetchOrders);
  yield takeLatest(createOrderRequest.type, handleCreateOrder);
  yield takeLatest(trackOrderRequest.type, handleTrackOrder);
  yield takeLatest(updateOrderStatusRequest.type, handleUpdateOrderStatus);
  yield takeLatest(deleteOrderRequest.type, handleDeleteOrder);
}
