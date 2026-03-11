import type { UserRole } from "@prisma/client";

export type Permission =
  | "manage:organization"
  | "manage:subscription"
  | "invite:users"
  | "manage:users"
  | "view:users"
  | "manage:projects"
  | "view:projects"
  | "manage:timetracking"
  | "view:timetracking"
  | "manage:finance"
  | "view:finance"
  | "view:own_data";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: [
    "manage:organization",
    "manage:subscription",
    "invite:users",
    "manage:users",
    "view:users",
    "manage:projects",
    "view:projects",
    "manage:timetracking",
    "view:timetracking",
    "manage:finance",
    "view:finance",
    "view:own_data",
  ],
  ADMIN: [
    "invite:users",
    "manage:users",
    "view:users",
    "manage:projects",
    "view:projects",
    "manage:timetracking",
    "view:timetracking",
    "view:finance",
    "view:own_data",
  ],
  MANAGER: [
    "view:users",
    "manage:projects",
    "view:projects",
    "manage:timetracking",
    "view:timetracking",
    "view:own_data",
  ],
  EMPLOYEE: ["view:projects", "view:timetracking", "view:own_data"],
  ACCOUNTANT: [
    "view:users",
    "view:projects",
    "view:timetracking",
    "manage:finance",
    "view:finance",
    "view:own_data",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Inhaber",
  ADMIN: "Administrator",
  MANAGER: "Manager",
  EMPLOYEE: "Mitarbeiter",
  ACCOUNTANT: "Buchhalter",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  OWNER: "bg-purple-100 text-purple-800",
  ADMIN: "bg-blue-100 text-blue-800",
  MANAGER: "bg-green-100 text-green-800",
  EMPLOYEE: "bg-gray-100 text-gray-800",
  ACCOUNTANT: "bg-yellow-100 text-yellow-800",
};
