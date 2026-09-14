import { supabase, isSupabaseConfigured } from "./client";
import type { AppNotification } from "../../types/notification";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_NOTIF_KEY = "exynos_notifications";

export const notificationService = {
  async fetchNotifications(userId: string): Promise<AppNotification[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((n) => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type || "order",
          isRead: n.is_read,
          linkUrl: n.link_url,
          createdAt: n.created_at,
        }));
      }
    }

    const localList = loadFromStorage<AppNotification[]>(
      LOCAL_STORAGE_NOTIF_KEY,
      [],
    );
    return localList.filter((n) => n.userId === userId);
  },

  async markAsRead(id: string): Promise<string> {
    if (isSupabaseConfigured) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
    }

    const localList = loadFromStorage<AppNotification[]>(
      LOCAL_STORAGE_NOTIF_KEY,
      [],
    );
    const updated = localList.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    localStorage.setItem(LOCAL_STORAGE_NOTIF_KEY, JSON.stringify(updated));
    return id;
  },

  subscribeToOrderUpdates(
    orderId: string,
    onStatusChange: (status: string) => void,
  ) {
    if (!isSupabaseConfigured) {
      // Realtime subscription no-op in offline mode
      return () => {};
    }

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const record = payload.new as { status?: string } | null;
          if (record?.status) {
            onStatusChange(record.status);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
