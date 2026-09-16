import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@src/store/index";
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
} from "@src/store/slices/aiSlice";
import { aiService } from "@src/services/ai/aiService";
import type {
  AIMessage,
  AIBoxRecommendation,
  AdminAIInsight,
} from "@src/types/ai";

function* handleAskAI(
  action: PayloadAction<{ prompt: string }>,
): Generator<unknown, void, unknown> {
  try {
    const allMessages = (yield select(
      (state: RootState) => state.ai.messages,
    )) as AIMessage[];

    // Forward past conversation context (last 6 turns, excluding the current pending prompt)
    const history = (allMessages || [])
      .slice(0, -1)
      .filter((m) => m.sender === "user" || m.sender === "assistant")
      .slice(-6)
      .map((m) => ({
        role: m.sender as "user" | "assistant",
        content: m.content,
      }));

    const response = (yield call(aiService.askAssistant, {
      prompt: action.payload.prompt,
      conversationHistory: history,
    })) as AIMessage;
    yield put(askAISuccess(response));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI service unavailable";
    yield put(askAIFailure(msg));
  }
}

function* handleBuildBox(
  action: PayloadAction<{ boxSize: 4 | 6 | 12; preferences: string }>,
): Generator<unknown, void, unknown> {
  try {
    const recommendation = (yield call(aiService.buildBox, {
      boxSize: action.payload.boxSize,
      preferences: action.payload.preferences,
    })) as AIBoxRecommendation;
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
): Generator<unknown, void, unknown> {
  try {
    const insights = (yield call(
      aiService.getAdminInsights,
      action.payload,
    )) as AdminAIInsight[];
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
