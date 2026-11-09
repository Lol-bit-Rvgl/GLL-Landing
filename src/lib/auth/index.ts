/**
 * AUTH LAYER - Sistema de autenticación y autorización
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "MODERATOR";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Verificar si el usuario tiene un rol específico o superior
 */
export function hasRole(user: { role?: Role } | null | undefined, role: Role): boolean {
  if (!user?.role) return false;

  const roleHierarchy: Role[] = ["MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"];
  const userRoleIndex = roleHierarchy.indexOf(user.role);
  const requiredRoleIndex = roleHierarchy.indexOf(role);

  return userRoleIndex >= requiredRoleIndex;
}

/**
 * Verificar si el usuario es SUPER_ADMIN
 */
export function isSuperAdmin(user: { role?: Role } | null | undefined): boolean {
  return user?.role === "SUPER_ADMIN";
}