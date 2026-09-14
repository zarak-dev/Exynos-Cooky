import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile } from "../../types/auth";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_USERS_KEY = "exynos_registered_profiles";

export interface CustomerHistoryItem {
  index: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

const SEED_CUSTOMERS: CustomerHistoryItem[] = [
  {
    index: 1,
    uuid: "cust-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+92 300 1234567",
    role: "customer",
    ordersCount: 4,
    totalSpent: 5960,
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    index: 2,
    uuid: "cust-2",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+92 321 9876543",
    role: "customer",
    ordersCount: 2,
    totalSpent: 2840,
    createdAt: "2026-02-10T11:20:00Z",
  },
  {
    index: 3,
    uuid: "cust-3",
    name: "Aisha Patel",
    email: "aisha.patel@example.com",
    phone: "+92 333 4567890",
    role: "customer",
    ordersCount: 6,
    totalSpent: 8790,
    createdAt: "2026-02-18T14:45:00Z",
  },
  {
    index: 4,
    uuid: "cust-4",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+92 345 5678901",
    role: "customer",
    ordersCount: 1,
    totalSpent: 1440,
    createdAt: "2026-03-01T16:10:00Z",
  },
  {
    index: 5,
    uuid: "cust-5",
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+92 312 3456789",
    role: "customer",
    ordersCount: 3,
    totalSpent: 4230,
    createdAt: "2026-03-05T10:30:00Z",
  },
];

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          name: data.full_name || "Customer",
          role: data.role || "customer",
          phone: data.phone,
          avatarUrl: data.avatar_url,
          marketingPreferences: data.marketing_preferences,
        };
      }
    }
    return null;
  },

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    if (isSupabaseConfigured) {
      await supabase
        .from("profiles")
        .update({
          full_name: updates.name,
          phone: updates.phone,
          avatar_url: updates.avatarUrl,
          marketing_preferences: updates.marketingPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    return {
      id: userId,
      email: updates.email || "",
      name: updates.name || "Customer",
      role: updates.role || "customer",
      phone: updates.phone,
      avatarUrl: updates.avatarUrl,
      marketingPreferences: updates.marketingPreferences,
    };
  },

  async fetchCustomerList(): Promise<CustomerHistoryItem[]> {
    if (isSupabaseConfigured) {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          phone,
          role,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (!error && profiles && profiles.length > 0) {
        return profiles.map((p, idx) => ({
          index: idx + 1,
          uuid: p.id,
          name: p.full_name || "Customer",
          email: p.email || "",
          phone: p.phone || "N/A",
          role: p.role || "customer",
          ordersCount: 0,
          totalSpent: 0,
          createdAt: p.created_at || new Date().toISOString(),
        }));
      }
    }

    return loadFromStorage<CustomerHistoryItem[]>(
      LOCAL_STORAGE_USERS_KEY,
      SEED_CUSTOMERS,
    );
  },
};
