import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppNotification } from "../../types/notification";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationState = {
  notifications: [
    {
      id: "notif-1",
      userId: "all",
      title: "Welcome to Exynos Cooky! 🍪",
      message: "Use coupon WELCOME10 for 10% off your first handcrafted box!",
      type: "coupon",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 1,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotificationsRequest: (state, action: PayloadAction<string>) => {
      void action;
      state.loading = true;
    },
    fetchNotificationsSuccess: (
      state,
      action: PayloadAction<AppNotification[]>,
    ) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.loading = false;
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const target = state.notifications.find((n) => n.id === action.payload);
      if (target && !target.isRead) {
        target.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
});

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
