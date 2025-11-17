// Role definitions
export const ROLES = {
  OWNER: "owner",
  PROPERTY_MANAGER: "property_manager",
  BOOKKEEPER: "bookkeeper",
  MAINTENANCE: "maintenance",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Permission definitions
export const PERMISSIONS = {
  // Properties
  PROPERTIES_VIEW: "properties:view",
  PROPERTIES_CREATE: "properties:create",
  PROPERTIES_EDIT: "properties:edit",
  PROPERTIES_DELETE: "properties:delete",

  // People / Clients
  PEOPLE_VIEW: "people:view",
  PEOPLE_CREATE: "people:create",
  PEOPLE_EDIT: "people:edit",
  PEOPLE_DELETE: "people:delete",

  // Accounting
  ACCOUNTING_VIEW: "accounting:view",
  ACCOUNTING_CREATE: "accounting:create",
  ACCOUNTING_EDIT: "accounting:edit",
  ACCOUNTING_DELETE: "accounting:delete",
  ACCOUNTING_APPROVE: "accounting:approve",

  // Employees
  EMPLOYEES_VIEW: "employees:view",
  EMPLOYEES_CREATE: "employees:create",
  EMPLOYEES_EDIT: "employees:edit",
  EMPLOYEES_DELETE: "employees:delete",

  // System Settings
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  ROLES_MANAGE: "roles:manage",
  USERS_MANAGE: "users:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.OWNER]: [
    // Owners have all permissions
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PROPERTIES_CREATE,
    PERMISSIONS.PROPERTIES_EDIT,
    PERMISSIONS.PROPERTIES_DELETE,
    PERMISSIONS.PEOPLE_VIEW,
    PERMISSIONS.PEOPLE_CREATE,
    PERMISSIONS.PEOPLE_EDIT,
    PERMISSIONS.PEOPLE_DELETE,
    PERMISSIONS.ACCOUNTING_VIEW,
    PERMISSIONS.ACCOUNTING_CREATE,
    PERMISSIONS.ACCOUNTING_EDIT,
    PERMISSIONS.ACCOUNTING_DELETE,
    PERMISSIONS.ACCOUNTING_APPROVE,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.EMPLOYEES_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.USERS_MANAGE,
  ],
  [ROLES.PROPERTY_MANAGER]: [
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PROPERTIES_CREATE,
    PERMISSIONS.PROPERTIES_EDIT,
    PERMISSIONS.PEOPLE_VIEW,
    PERMISSIONS.PEOPLE_CREATE,
    PERMISSIONS.PEOPLE_EDIT,
    PERMISSIONS.ACCOUNTING_VIEW,
    PERMISSIONS.ACCOUNTING_CREATE,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  [ROLES.BOOKKEEPER]: [
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PEOPLE_VIEW,
    PERMISSIONS.ACCOUNTING_VIEW,
    PERMISSIONS.ACCOUNTING_CREATE,
    PERMISSIONS.ACCOUNTING_EDIT,
  ],
  [ROLES.MAINTENANCE]: [
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PEOPLE_VIEW,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PEOPLE_VIEW,
    PERMISSIONS.ACCOUNTING_VIEW,
  ],
};

// User type with role
export interface UserWithRole {
  id: string;
  email: string;
  role: Role;
  customPermissions?: Permission[]; // Optional: for custom per-user permissions
}
