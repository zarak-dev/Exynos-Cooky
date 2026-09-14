import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  askAIRequest,
  askAISuccess,
  askAIFailure,
  buildBoxRequest,
  buildBoxSuccess,
  buildBoxFailure,
  fetchAdminInsightsRequest,
  fetchAdminInsightsSuccess,
  fetchAdminInsightsFailure,
} from "../slices/aiSlice";
import { aiService } from "../../services/ai/aiService";
import type {
  AIMessage,
  AIBoxRecommendation,
  AdminAIInsight,
} from "../../types/ai";

function* handleAskAI(
  action: PayloadAction<{ prompt: string }>,
): Generator<unknown, void, AIMessage> {
  try {
    const response = yield call(aiService.askAssistant, {
      prompt: action.payload.prompt,
    });
    yield put(askAISuccess(response));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI service unavailable";
    yield put(askAIFailure(msg));
  }
}

function* handleBuildBox(
  action: PayloadAction<{ boxSize: 4 | 6 | 12; preferences: string }>,
): Generator<unknown, void, AIBoxRecommendation> {
  try {
    const recommendation = yield call(aiService.buildBox, {
      boxSize: action.payload.boxSize,
      preferences: action.payload.preferences,
    });
    yield put(buildBoxSuccess(recommendation));
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Box Builder unavailable";
    yield put(buildBoxFailure(msg));
  }
}

function* handleFetchAdminInsights(
  action: PayloadAction<{
    totalOrders: number;
    netRevenue: number;
    topSellers: Array<{ name: string; count: number }>;
    lowStockItems: Array<{ name: string; stock: number }>;
  }>,
): Generator<unknown, void, AdminAIInsight[]> {
  try {
    const insights = yield call(aiService.getAdminInsights, action.payload);
    yield put(fetchAdminInsightsSuccess(insights));
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Insights generation failed";
    yield put(fetchAdminInsightsFailure(msg));
  }
}

export function* aiSaga() {
  yield takeLatest(askAIRequest.type, handleAskAI);
  yield takeLatest(buildBoxRequest.type, handleBuildBox);
  yield takeLatest(fetchAdminInsightsRequest.type, handleFetchAdminInsights);
}
