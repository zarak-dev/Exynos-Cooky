import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  toggleAvailabilityRequest,
  toggleAvailabilitySuccess,
  toggleAvailabilityFailure,
  addProductRequest,
  addProductSuccess,
  addProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
} from "../slices/inventorySlice";
import { productService } from "../../services/supabase/productService";
import type { Product } from "../../types/product";

function* handleFetchInventory(): Generator<unknown, void, unknown> {
  try {
    const existing = (yield select(
      (state: RootState) => state.inventory.items,
    )) as Product[];
    if (existing && existing.length > 0) {
      return;
    }
    const products = (yield call(productService.fetchProducts)) as Product[];
    yield put(fetchInventorySuccess(products));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load inventory";
    yield put(fetchInventoryFailure(message));
  }
}

function* handleToggleAvailability(
  action: PayloadAction<{ id: number; isAvailable: boolean }>,
): Generator<unknown, void, { id: number; isAvailable: boolean }> {
  try {
    const result = yield call(
      productService.toggleAvailability,
      action.payload.id,
      action.payload.isAvailable,
    );
    yield put(toggleAvailabilitySuccess(result));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update availability";
    yield put(toggleAvailabilityFailure(message));
  }
}

function* handleAddProduct(
  action: PayloadAction<Omit<Product, "id">>,
): Generator<unknown, void, Product> {
  try {
    const newProduct = yield call(productService.addProduct, action.payload);
    yield put(addProductSuccess(newProduct));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to add product";
    yield put(addProductFailure(message));
  }
}

function* handleUpdateProduct(
  action: PayloadAction<{ id: number; updates: Partial<Product> }>,
): Generator<unknown, void, Product> {
  try {
    const updated = yield call(
      productService.updateProduct,
      action.payload.id,
      action.payload.updates,
    );
    yield put(updateProductSuccess(updated));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update product";
    yield put(updateProductFailure(message));
  }
}

function* handleDeleteProduct(
  action: PayloadAction<number>,
): Generator<unknown, void, number> {
  try {
    const deletedId = yield call(productService.deleteProduct, action.payload);
    yield put(deleteProductSuccess(deletedId));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete product";
    yield put(deleteProductFailure(message));
  }
}

export function* inventorySaga() {
  yield takeLatest(fetchInventoryRequest.type, handleFetchInventory);
  yield takeLatest(toggleAvailabilityRequest.type, handleToggleAvailability);
  yield takeLatest(addProductRequest.type, handleAddProduct);
  yield takeLatest(updateProductRequest.type, handleUpdateProduct);
  yield takeLatest(deleteProductRequest.type, handleDeleteProduct);
}
