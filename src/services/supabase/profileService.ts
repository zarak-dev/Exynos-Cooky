import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile } from "@src/types/auth";

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

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to load profile: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      name: data.full_name || "Valued Customer",
      role: data.role || "customer",
      phone: data.phone,
      avatarUrl: data.avatar_url,
      marketingPreferences: data.marketing_preferences,
    };
  },

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      const localSession = localStorage.getItem("exynos_admin_session");
      if (localSession) {
        const parsed = JSON.parse(localSession) as UserProfile;
        const updated: UserProfile = {
          ...parsed,
          name: updates.name?.trim() || parsed.name,
          phone: updates.phone?.trim() || parsed.phone,
        };
        localStorage.setItem("exynos_admin_session", JSON.stringify(updated));
        return updated;
      }
      throw new Error("Supabase is not configured. Cannot update profile.");
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) {
      updatePayload.full_name = updates.name.trim();
    }
    if (updates.phone !== undefined) {
      updatePayload.phone = updates.phone.trim();
    }
    if (updates.avatarUrl !== undefined) {
      updatePayload.avatar_url = updates.avatarUrl;
    }
    if (updates.marketingPreferences !== undefined) {
      updatePayload.marketing_preferences = updates.marketingPreferences;
    }

    // Role, email, and id are intentionally immutable via standard client profile updates
    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error || !data) {
      const localSession = localStorage.getItem("exynos_admin_session");
      if (localSession) {
        const parsed = JSON.parse(localSession) as UserProfile;
        const updated: UserProfile = {
          ...parsed,
          name: updates.name?.trim() || parsed.name,
          phone: updates.phone?.trim() || parsed.phone,
        };
        localStorage.setItem("exynos_admin_session", JSON.stringify(updated));
        return updated;
      }
      throw new Error(`Profile update failed: ${error?.message || "Record not found"}`);
    }

    if (data.role === "admin") {
      try {
        localStorage.setItem("exynos_admin_session", JSON.stringify({
          id: data.id,
          email: data.email,
          name: data.full_name,
          role: data.role,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          marketingPreferences: data.marketing_preferences,
        }));
      } catch {}
    }

    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      role: data.role,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      marketingPreferences: data.marketing_preferences,
    };
  },

  async fetchCustomerList(): Promise<CustomerHistoryItem[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot load customers.");
    }

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

    if (error) {
      throw new Error(`Failed to load customer list: ${error.message}`);
    }

    return (profiles || []).map((p, idx) => ({
      index: idx + 1,
      uuid: p.id,
      name: p.full_name || "Valued Customer",
      email: p.email || "",
      phone: p.phone || "N/A",
      role: p.role || "customer",
      ordersCount: 0,
      totalSpent: 0,
      createdAt: p.created_at || new Date().toISOString(),
    }));
  },

  async deleteCustomer(userId: string): Promise<string> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot delete customer.");
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }

    return userId;
  },
};
