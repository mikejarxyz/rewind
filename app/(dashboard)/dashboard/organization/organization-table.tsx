"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateUserRole, removeUserFromOrganization } from "@/actions/organization";
import { Trash2 } from "lucide-react";
import type { Profile } from "@/types/database";

interface OrganizationTableProps {
  users: Profile[];
  currentUser: {
    id: string;
    email: string | undefined;
    organizationId: string;
    role: "owner" | "property_manager" | "bookkeeper" | "maintenance" | "viewer";
  };
}

const roleColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  owner: "default",
  property_manager: "secondary",
  bookkeeper: "secondary",
  maintenance: "secondary",
  viewer: "outline",
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  property_manager: "Property Manager",
  bookkeeper: "Bookkeeper",
  maintenance: "Maintenance",
  viewer: "Viewer",
};

export function OrganizationTable({ users, currentUser }: OrganizationTableProps) {
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [removingUser, setRemovingUser] = useState<string | null>(null);

  const isOwner = currentUser.role === "owner";

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingRole(userId);

    const result = await updateUserRole(userId, newRole);

    setUpdatingRole(null);

    if (result.error) {
      toast.error("Failed to update role", {
        description: result.error,
      });
    } else {
      toast.success("Role updated successfully");
    }
  }

  async function handleRemoveUser(userId: string) {
    setRemovingUser(userId);

    const result = await removeUserFromOrganization(userId);

    setRemovingUser(null);

    if (result.error) {
      toast.error("Failed to remove user", {
        description: result.error,
      });
    } else {
      toast.success("User removed successfully");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          {isOwner && <TableHead className="w-[100px]">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isCurrentUser = user.id === currentUser.id;
          const isUpdating = updatingRole === user.id;
          const isRemoving = removingUser === user.id;

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.email}</span>
                  {isCurrentUser && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {isOwner && !isCurrentUser ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={roleColors[user.role] || "outline"}>
                    {roleLabels[user.role] || user.role}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              {isOwner && (
                <TableCell>
                  {!isCurrentUser && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isRemoving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {user.email} from your organization?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveUser(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
