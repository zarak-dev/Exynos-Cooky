import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AIMessage,
  AIBoxRecommendation,
  AdminAIInsight,
} from "@src/types/ai";

interface AIState {
  isAIAssistantOpen: boolean;
  messages: AIMessage[];
  activeBoxRecommendation: AIBoxRecommendation | null;
  adminInsights: AdminAIInsight[];
  loading: boolean;
  boxLoading: boolean;
  insightsLoading: boolean;
  error: string | null;
}

const initialState: AIState = {
  isAIAssistantOpen: false,
  messages: [
    {
      id: "ai-init",
      sender: "assistant",
      content:
        "Hello sweet friend! 🍪✨ Welcome to Exynos Cooky! I'm Cooky, your personal artisan baker. Every single one of our 190+ cookies is lovingly handcrafted and baked fresh daily. What delicious flavor are you craving today — warm gooey chocolate, golden caramel Biscoff, or something velvety and fruity? Tell me what you adore and I'll share the sweetest options with you! 💖",
      timestamp: new Date().toISOString(),
    },
  ],
  activeBoxRecommendation: null,
  adminInsights: [],
  loading: false,
  boxLoading: false,
  insightsLoading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setAIAssistantOpen: (state, action: PayloadAction<boolean>) => {
      state.isAIAssistantOpen = action.payload;
    },

    askAIRequest: (
      state,
      action: PayloadAction<{
        prompt: string;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
      state.messages.push({
        id: `user-${Date.now()}`,
        sender: "user",
        content: action.payload.prompt,
        timestamp: new Date().toISOString(),
      });
    },
    askAISuccess: (state, action: PayloadAction<AIMessage>) => {
      state.messages.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    askAIFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.messages.push({
        id: `ai-err-${Date.now()}`,
        sender: "assistant",
        content: `Oh dear sweet friend, my oven timer chimed and I had a tiny moment of trouble looking that up! Please ask me again, sweetheart, and I will be overjoyed to find the sweetest matching options for you. 🍪✨`,
        timestamp: new Date().toISOString(),
      });
    },

    buildBoxRequest: (
      state,
      action: PayloadAction<{ boxSize: 4 | 6 | 12; preferences: string }>,
    ) => {
      void action;
      state.boxLoading = true;
      state.error = null;
    },
    buildBoxSuccess: (state, action: PayloadAction<AIBoxRecommendation>) => {
      state.activeBoxRecommendation = action.payload;
      state.boxLoading = false;
      state.error = null;
    },
    buildBoxFailure: (state, action: PayloadAction<string>) => {
      state.boxLoading = false;
      state.error = action.payload;
    },

    fetchAdminInsightsRequest: (
      state,
      action: PayloadAction<{
        totalOrders: number;
        netRevenue: number;
        topSellers: Array<{ name: string; count: number }>;
        lowStockItems: Array<{ name: string; stock: number }>;
      }>,
    ) => {
      void action;
      state.insightsLoading = true;
      state.error = null;
    },
    fetchAdminInsightsSuccess: (
      state,
      action: PayloadAction<AdminAIInsight[]>,
    ) => {
      state.adminInsights = action.payload;
      state.insightsLoading = false;
    },
    fetchAdminInsightsFailure: (state, action: PayloadAction<string>) => {
      state.insightsLoading = false;
      state.error = action.payload;
    },

    clearAIConversation: (state) => {
      state.messages = [
        {
          id: `ai-init-${Date.now()}`,
          sender: "assistant",
          content:
            "Chat cleared! How can I help you discover our artisan cookies today? 🍪",
          timestamp: new Date().toISOString(),
        },
      ];
      state.error = null;
    },
  },
});

export const {
  setAIAssistantOpen,
  askAIRequest,
  askAISuccess,
  askAIFailure,
  buildBoxRequest,
  buildBoxSuccess,
  buildBoxFailure,
  fetchAdminInsightsRequest,
  fetchAdminInsightsSuccess,
  fetchAdminInsightsFailure,
  clearAIConversation,
} = aiSlice.actions;

export default aiSlice.reducer;
