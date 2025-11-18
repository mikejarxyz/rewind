'use client'

import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '@/types/permissions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

// Group permissions by category
const permissionGroups = {
  Properties: [
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PROPERTIES_CREATE,
    PERMISSIONS.PROPERTIES_EDIT,
    PERMISSIONS.PROPERTIES_DELETE,
  ],
  People: [
    PERMISSIONS.PEOPLE_VIEW,
    PERMISSIONS.PEOPLE_CREATE,
    PERMISSIONS.PEOPLE_EDIT,
    PERMISSIONS.PEOPLE_DELETE,
  ],
  Accounting: [
    PERMISSIONS.ACCOUNTING_VIEW,
    PERMISSIONS.ACCOUNTING_CREATE,
    PERMISSIONS.ACCOUNTING_EDIT,
    PERMISSIONS.ACCOUNTING_DELETE,
    PERMISSIONS.ACCOUNTING_APPROVE,
  ],
  Employees: [
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.EMPLOYEES_DELETE,
  ],
  System: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.USERS_MANAGE,
  ],
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  property_manager: 'Property Manager',
  bookkeeper: 'Bookkeeper',
  maintenance: 'Maintenance',
  viewer: 'Viewer',
}

const permissionLabels: Record<string, string> = {
  'properties:view': 'View',
  'properties:create': 'Create',
  'properties:edit': 'Edit',
  'properties:delete': 'Delete',
  'people:view': 'View',
  'people:create': 'Create',
  'people:edit': 'Edit',
  'people:delete': 'Delete',
  'accounting:view': 'View',
  'accounting:create': 'Create',
  'accounting:edit': 'Edit',
  'accounting:delete': 'Delete',
  'accounting:approve': 'Approve',
  'employees:view': 'View',
  'employees:create': 'Create',
  'employees:edit': 'Edit',
  'employees:delete': 'Delete',
  'settings:view': 'View',
  'settings:edit': 'Edit',
  'roles:manage': 'Manage Roles',
  'users:manage': 'Manage Users',
}

export function RolesTable() {
  const roles = [
    ROLES.OWNER,
    ROLES.PROPERTY_MANAGER,
    ROLES.BOOKKEEPER,
    ROLES.MAINTENANCE,
    ROLES.VIEWER,
  ]

  const hasPermission = (role: string, permission: string) => {
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]?.includes(
      permission as any
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(permissionGroups).map(([category, permissions]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role} className="text-center">
                      <Badge variant="outline">{roleLabels[role]}</Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission}>
                    <TableCell className="font-medium">
                      {permissionLabels[permission]}
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role}-${permission}`} className="text-center">
                        {hasPermission(role, permission) ? (
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  )
}
