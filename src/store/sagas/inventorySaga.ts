import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  toggleAvailabilityRequest,
  toggleItemAvailability,
  addProductRequest,
  addProductSuccess,
  updateProductRequest,
  updateProductSuccess,
  deleteProductRequest,
  deleteItem,
} from "../slices/inventorySlice";
import { productService } from "../../services/supabase/productService";
import type { Product } from "../../types/product";

function* handleFetchInventory(): Generator<unknown, void, Product[]> {
  try {
    const products = yield call(productService.fetchProducts);
    yield put(fetchInventorySuccess(products));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load inventory";
    yield put(fetchInventoryFailure(message));
  }
}

function* handleToggleAvailability(
  action: PayloadAction<{ id: number; isAvailable: boolean }>,
): Generator {
  try {
    yield put(toggleItemAvailability(action.payload));
    yield call(
      productService.toggleAvailability,
      action.payload.id,
      action.payload.isAvailable,
    );
  } catch (err) {
    console.warn("Error updating availability:", err);
  }
}

function* handleAddProduct(
  action: PayloadAction<Omit<Product, "id">>,
): Generator<unknown, void, Product> {
  try {
    const newProduct = yield call(productService.addProduct, action.payload);
    yield put(addProductSuccess(newProduct));
  } catch (err) {
    console.warn("Error adding product:", err);
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
  } catch (err) {
    console.warn("Error updating product:", err);
  }
}

function* handleDeleteProduct(action: PayloadAction<number>): Generator {
  try {
    yield put(deleteItem(action.payload));
    yield call(productService.deleteProduct, action.payload);
  } catch (err) {
    console.warn("Error deleting product:", err);
  }
}

export function* inventorySaga() {
  yield takeLatest(fetchInventoryRequest.type, handleFetchInventory);
  yield takeLatest(toggleAvailabilityRequest.type, handleToggleAvailability);
  yield takeLatest(addProductRequest.type, handleAddProduct);
  yield takeLatest(updateProductRequest.type, handleUpdateProduct);
  yield takeLatest(deleteProductRequest.type, handleDeleteProduct);
}
