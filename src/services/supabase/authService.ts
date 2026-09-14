import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile, UserRole } from "../../types/auth";
import { ADMIN_EMAIL } from "../../constants/roles";

const LOCAL_STORAGE_SESSION_KEY = "exynos_auth_session";

export const authService = {
  async signUp(
    email: string,
    password?: string,
    name?: string,
  ): Promise<UserProfile> {
    if (isSupabaseConfigured && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || "Customer",
          },
        },
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Registration failed: No user returned");

      const role: UserRole =
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";

      // Upsert profile in Supabase
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: name || "Customer",
        role,
      });

      if (profileError) {
        console.warn("Could not upsert profile:", profileError.message);
      }

      return {
        id: data.user.id,
        email: data.user.email || email,
        name: name || "Customer",
        role,
      };
    }

    // Offline / Demo Fallback Mode
    const role: UserRole =
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";
    const profile: UserProfile = {
      id: `local-user-${Date.now()}`,
      email,
      name: name || (role === "admin" ? "System Administrator" : "Customer"),
      role,
    };

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
    return profile;
  },

  async signIn(email: string, password?: string): Promise<UserProfile> {
    if (isSupabaseConfigured && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Login failed: No user returned");

      // Fetch profile from database
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const role: UserRole =
        profileData?.role ||
        (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer");

      return {
        id: data.user.id,
        email: data.user.email || email,
        name:
          profileData?.full_name ||
          (role === "admin" ? "System Administrator" : "Valued Customer"),
        role,
        phone: profileData?.phone,
        avatarUrl: profileData?.avatar_url,
        marketingPreferences: profileData?.marketing_preferences,
      };
    }

    // Offline / Demo Fallback Mode
    const role: UserRole =
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";
    const profile: UserProfile = {
      id: `local-user-${email}`,
      email,
      name: role === "admin" ? "System Administrator" : "Valued Customer",
      role,
    };

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
    return profile;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signout notice:", err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  },

  async restoreSession(): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        return null;
      }

      const user = data.session.user;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const role: UserRole =
        profileData?.role ||
        (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? "admin"
          : "customer");

      return {
        id: user.id,
        email: user.email || "",
        name:
          profileData?.full_name ||
          (role === "admin" ? "System Administrator" : "Valued Customer"),
        role,
        phone: profileData?.phone,
        avatarUrl: profileData?.avatar_url,
        marketingPreferences: profileData?.marketing_preferences,
      };
    }

    // Restore from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      return saved ? (JSON.parse(saved) as UserProfile) : null;
    } catch {
      return null;
    }
  },
};
