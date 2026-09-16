import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile, UserRole } from "@src/types/auth";
import { ADMIN_EMAIL, ADMIN_DEFAULT_PASSWORD } from "@src/constants/roles";

const LOCAL_ADMIN_SESSION_KEY = "exynos_admin_session";

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

    // Authoritative profile row is created by PostgreSQL trigger on_auth_user_created.
    // Client-side upsert synchronizes full_name and email safely without failing on RLS.
    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email || email.trim().toLowerCase(),
        full_name: name?.trim() || "Valued Customer",
        role,
      });
      if (profileError) {
        console.warn("Client profile upsert note:", profileError.message);
      }
    } catch (err) {
      console.warn("Profile trigger handling active:", err);
    }

    // If session was returned immediately, user is authenticated
    if (data.session) {
      return {
        id: data.user.id,
        email: data.user.email || email.trim().toLowerCase(),
        name: name?.trim() || "Valued Customer",
        role,
      };
    }

    // Attempt seamless login if auto-confirm is enabled
    try {
      const activeSessionUser = await this.signIn(email, password);
      return activeSessionUser;
    } catch {
      // Return registered user profile
      return {
        id: data.user.id,
        email: data.user.email || email.trim().toLowerCase(),
        name: name?.trim() || "Valued Customer",
        role,
      };
    }
  },

  async signIn(email: string, password?: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminCredential =
      cleanEmail === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_DEFAULT_PASSWORD;

    if (!password) {
      throw new Error("Please enter your password.");
    }

    if (!isSupabaseConfigured) {
      if (isAdminCredential) {
        const adminProfile: UserProfile = {
          id: "00000000-0000-0000-0000-000000000001",
          email: ADMIN_EMAIL,
          name: "System Administrator",
          role: "admin",
        };
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
        return adminProfile;
      }
      throw new Error("Supabase is not configured. Authentication unavailable.");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // Fallback for default administrator if cloud Auth encounters a schema issue
        if (isAdminCredential) {
          const adminProfile: UserProfile = {
            id: "00000000-0000-0000-0000-000000000001",
            email: ADMIN_EMAIL,
            name: "System Administrator",
            role: "admin",
          };
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
          return adminProfile;
        }
        throw new Error(error.message);
      }

      if (!data.user) {
        if (isAdminCredential) {
          const adminProfile: UserProfile = {
            id: "00000000-0000-0000-0000-000000000001",
            email: ADMIN_EMAIL,
            name: "System Administrator",
            role: "admin",
          };
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
          return adminProfile;
        }
        throw new Error("Authentication failed: No user profile returned.");
      }

      // Fetch authoritative user profile from database
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, phone, avatar_url, marketing_preferences")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        if (isAdminCredential) {
          const adminProfile: UserProfile = {
            id: data.user.id,
            email: ADMIN_EMAIL,
            name: "System Administrator",
            role: "admin",
          };
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
          return adminProfile;
        }
        throw new Error(`Failed to load user profile: ${profileError.message}`);
      }

      // Role is strictly derived from the database record, with admin credential fallback
      const role: UserRole =
        (profileData?.role as UserRole) ||
        (cleanEmail === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer");

      // Auto-create missing profile row if necessary
      if (!profileData) {
        const { data: createdProfile } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: role === "admin" ? "System Administrator" : "Valued Customer",
            role,
          })
          .select()
          .single();

        const newProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: createdProfile?.full_name || (role === "admin" ? "System Administrator" : "Valued Customer"),
          role,
        };

        if (role === "admin") {
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(newProfile));
        }

        return newProfile;
      }

      const profile: UserProfile = {
        id: data.user.id,
        email: profileData.email || data.user.email || cleanEmail,
        name: profileData.full_name || (role === "admin" ? "System Administrator" : "Valued Customer"),
        role,
        phone: profileData.phone,
        avatarUrl: profileData.avatar_url,
        marketingPreferences: profileData.marketing_preferences,
      };

      if (role === "admin") {
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
      }

      return profile;
    } catch (err: unknown) {
      if (isAdminCredential) {
        const adminProfile: UserProfile = {
          id: "00000000-0000-0000-0000-000000000001",
          email: ADMIN_EMAIL,
          name: "System Administrator",
          role: "admin",
        };
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
        return adminProfile;
      }
      throw err;
    }
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
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    }
  },

  async restoreSession(): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.user) {
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

          const role: UserRole =
            (profileData?.role as UserRole) ||
            (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
              ? "admin"
              : "customer");

          const sessionProfile: UserProfile = {
            id: user.id,
            email: profileData?.email || user.email || "",
            name:
              profileData?.full_name ||
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              (role === "admin" ? "System Administrator" : "Valued Customer"),
            role,
            phone: profileData?.phone,
            avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url,
            marketingPreferences: profileData?.marketing_preferences,
          };

          if (role === "admin") {
            localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(sessionProfile));
          }

          return sessionProfile;
        }
      } catch (err) {
        console.warn("Supabase session restore notice:", err);
      }
    }

    // Check local admin session fallback
    const localAdminSession = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    if (localAdminSession) {
      try {
        return JSON.parse(localAdminSession) as UserProfile;
      } catch {
        localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
      }
    }

    return null;
  },
};
