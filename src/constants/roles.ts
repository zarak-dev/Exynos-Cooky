import type { UserRole } from "../types/auth";

export const USER_ROLES: Record<string, UserRole> = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export const ADMIN_EMAIL = "admin@ec.com";
export const ADMIN_DEFAULT_PASSWORD = "12345678";
