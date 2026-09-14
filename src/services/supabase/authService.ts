import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile, UserRole } from "../../types/auth";

export const authService = {
  async signUp(
    email: string,
    password?: string,
    name?: string,
  ): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Authentication unavailable.");
    }
    if (!password) {
      throw new Error("A secure password is required for registration.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name?.trim() || "Valued Customer",
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    if (!data.user) {
      throw new Error("Registration failed: No user returned by authentication server.");
    }

    // Default role for any new self-registration is strictly 'customer'
    const role: UserRole = "customer";

    // Insert authoritative profile record
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email || email.trim().toLowerCase(),
      full_name: name?.trim() || "Valued Customer",
      role,
    });

    if (profileError) {
      throw new Error(`Profile setup failed: ${profileError.message}`);
    }

    return {
      id: data.user.id,
      email: data.user.email || email.trim().toLowerCase(),
      name: name?.trim() || "Valued Customer",
      role,
    };
  },

  async signIn(email: string, password?: string): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Authentication unavailable.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Authentication failed: No user profile returned.");
    }

    // Fetch authoritative user profile from database
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, phone, avatar_url, marketing_preferences")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to load user profile: ${profileError.message}`);
    }

    // Role is strictly derived from the database record
    const role: UserRole = (profileData?.role as UserRole) || "customer";

    // Auto-create missing profile row if necessary (default role: customer)
    if (!profileData) {
      const { data: createdProfile, error: createError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          email: data.user.email || cleanEmail,
          full_name: "Valued Customer",
          role: "customer",
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Could not initialize profile: ${createError.message}`);
      }

      return {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: createdProfile?.full_name || "Valued Customer",
        role: (createdProfile?.role as UserRole) || "customer",
      };
    }

    return {
      id: data.user.id,
      email: profileData.email || data.user.email || cleanEmail,
      name: profileData.full_name || "Valued Customer",
      role,
      phone: profileData.phone,
      avatarUrl: profileData.avatar_url,
      marketingPreferences: profileData.marketing_preferences,
    };
  },

  async signInWithOAuth(
    provider: "google" | "github" = "google",
  ): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase OAuth is not configured.");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    }
  },

  async restoreSession(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        return null;
      }

      const user = data.session.user;
      let { data: profileData } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, phone, avatar_url, marketing_preferences")
        .eq("id", user.id)
        .maybeSingle();

      // For first-time OAuth sign-ins, auto-create their customer profile record
      if (!profileData) {
        const metaName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.user_name ||
          "Valued Customer";
        const metaAvatar =
          user.user_metadata?.avatar_url || user.user_metadata?.picture;

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email || "",
            full_name: metaName,
            role: "customer",
            avatar_url: metaAvatar,
          })
          .select()
          .single();

        if (!createError && newProfile) {
          profileData = newProfile;
        }
      }

      const role: UserRole = (profileData?.role as UserRole) || "customer";

      return {
        id: user.id,
        email: profileData?.email || user.email || "",
        name:
          profileData?.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Valued Customer",
        role,
        phone: profileData?.phone,
        avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url,
        marketingPreferences: profileData?.marketing_preferences,
      };
    } catch {
      return null;
    }
  },
};
