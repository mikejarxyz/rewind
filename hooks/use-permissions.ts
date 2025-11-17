import { type Permission, type UserWithRole } from "@/types/permissions";
import {
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
  getUserPermissions,
  isOwner,
  canManageRoles,
} from "@/lib/auth/permissions";

/**
 * Hook to check permissions for the current user
 *
 * Usage:
 * ```tsx
 * const { hasPermission, hasAnyPermission, isOwner } = usePermissions(user);
 *
 * if (hasPermission(PERMISSIONS.PROPERTIES_CREATE)) {
 *   // Show create button
 * }
 * ```
 */
export function usePermissions(user: UserWithRole | null) {
  return {
    /**
     * Check if user has a specific permission
     */
    hasPermission: (permission: Permission) =>
      userHasPermission(user, permission),

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission: (permissions: Permission[]) =>
      userHasAnyPermission(user, permissions),

    /**
     * Check if user has all of the specified permissions
     */
    hasAllPermissions: (permissions: Permission[]) =>
      userHasAllPermissions(user, permissions),

    /**
     * Get all permissions for the user
     */
    permissions: getUserPermissions(user),

    /**
     * Check if user is an owner
     */
    isOwner: isOwner(user),

    /**
     * Check if user can manage roles
     */
    canManageRoles: canManageRoles(user),
  };
}
