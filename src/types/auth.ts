export type UserRole = "customer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  marketingPreferences?: {
    email: boolean;
    sms?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAt?: number;
  user: UserProfile;
}

export interface SignUpPayload {
  email: string;
  password?: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
