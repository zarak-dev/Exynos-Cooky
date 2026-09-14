import { supabase, isSupabaseConfigured } from "./client";
import type { UserProfile, UserRole } from "../../types/auth";
import { ADMIN_EMAIL, ADMIN_DEFAULT_PASSWORD } from "../../constants/roles";

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
    const cleanEmail = email.trim().toLowerCase();
    const isAdminCredential =
      cleanEmail === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_DEFAULT_PASSWORD;

    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          // If cloud Supabase sign-in fails, fallback to default admin credentials
          if (isAdminCredential) {
            const adminProfile: UserProfile = {
              id: "admin-default-id",
              email: ADMIN_EMAIL,
              name: "System Administrator",
              role: "admin",
            };
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(adminProfile));
            return adminProfile;
          }
          throw new Error(error.message);
        }

        if (!data.user) {
          if (isAdminCredential) {
            const adminProfile: UserProfile = {
              id: "admin-default-id",
              email: ADMIN_EMAIL,
              name: "System Administrator",
              role: "admin",
            };
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(adminProfile));
            return adminProfile;
          }
          throw new Error("Login failed: No user returned");
        }

        // Fetch profile from database
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const role: UserRole =
          profileData?.role ||
          (cleanEmail === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer");

        const profile: UserProfile = {
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

        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
        return profile;
      } catch (err) {
        if (isAdminCredential) {
          const adminProfile: UserProfile = {
            id: "admin-default-id",
            email: ADMIN_EMAIL,
            name: "System Administrator",
            role: "admin",
          };
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(adminProfile));
          return adminProfile;
        }
        throw err;
      }
    }

    // Offline / Demo Fallback Mode
    const role: UserRole =
      cleanEmail === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";
    const profile: UserProfile = {
      id: `local-user-${email}`,
      email,
      name: role === "admin" ? "System Administrator" : "Valued Customer",
      role,
    };

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
    return profile;
  },

  async signInWithOAuth(
    provider: "google" | "github" = "google",
  ): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw new Error(error.message);
      return;
    }

    // Demo fallback mode
    const demoEmail =
      provider === "google"
        ? "google.user@exynoscooky.com"
        : "github.user@exynoscooky.com";
    await this.signIn(demoEmail, "password123");
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
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session?.user) {
          const user = data.session.user;
          let { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          // For first-time OAuth sign-ins, auto-create their public profile record
          if (!profileData) {
            const defaultRole: UserRole =
              user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
                ? "admin"
                : "customer";
            const metaName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.user_metadata?.user_name ||
              "Google User";
            const metaAvatar =
              user.user_metadata?.avatar_url || user.user_metadata?.picture;

            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .upsert({
                id: user.id,
                email: user.email || "",
                full_name: metaName,
                role: defaultRole,
                avatar_url: metaAvatar,
              })
              .select("*")
              .single();

            if (!createError && newProfile) {
              profileData = newProfile;
            }
          }

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
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              (role === "admin" ? "System Administrator" : "Valued Customer"),
            role,
            phone: profileData?.phone,
            avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url,
            marketingPreferences: profileData?.marketing_preferences,
          };
        }
      } catch (err) {
        console.warn("Supabase session restore check:", err);
      }
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
