import type { UserRole } from "../types/auth";

export const USER_ROLES: Record<string, UserRole> = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;
