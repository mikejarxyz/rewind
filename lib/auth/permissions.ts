import {
  type Role,
  type Permission,
  type UserWithRole,
  ROLE_PERMISSIONS,
  ROLES,
} from "@/types/permissions";

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a user has a specific permission
 * Considers both role-based permissions and custom user permissions
 */
export function userHasPermission(
  user: UserWithRole | null,
  permission: Permission
): boolean {
  if (!user) return false;

  // Check role permissions
  const hasRolePermission = roleHasPermission(user.role, permission);

  // Check custom permissions (if any)
  const hasCustomPermission =
    user.customPermissions?.includes(permission) ?? false;

  return hasRolePermission || hasCustomPermission;
}

/**
 * Check if a user has any of the specified permissions
 */
export function userHasAnyPermission(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    userHasPermission(user, permission)
  );
}

/**
 * Check if a user has all of the specified permissions
 */
export function userHasAllPermissions(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    userHasPermission(user, permission)
  );
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: UserWithRole | null): Permission[] {
  if (!user) return [];

  const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];
  const customPermissions = user.customPermissions ?? [];

  // Combine and deduplicate
  return Array.from(new Set([...rolePermissions, ...customPermissions]));
}

/**
 * Check if a user is an owner
 */
export function isOwner(user: UserWithRole | null): boolean {
  return user?.role === ROLES.OWNER;
}

/**
 * Check if a user can manage roles
 */
export function canManageRoles(user: UserWithRole | null): boolean {
  return isOwner(user);
}

/**
 * Get a user-friendly role name
 */
export function getRoleName(role: Role): string {
  const roleNames: Record<Role, string> = {
    [ROLES.OWNER]: "Owner",
    [ROLES.PROPERTY_MANAGER]: "Property Manager",
    [ROLES.BOOKKEEPER]: "Bookkeeper",
    [ROLES.MAINTENANCE]: "Maintenance",
    [ROLES.VIEWER]: "Viewer",
  };

  return roleNames[role] ?? role;
}
