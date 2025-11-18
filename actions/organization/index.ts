"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Get all users in the current user's organization
 */
export async function getOrganizationUsers() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", user.organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { users };
}

/**
 * Update a user's role (owner only)
 */
export async function updateUserRole(userId: string, newRole: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Unauthorized" };
  }

  // Only owners can update roles
  if (currentUser.role !== "owner") {
    return { error: "Only owners can update user roles" };
  }

  // Validate role
  const validRoles = ["owner", "property_manager", "bookkeeper", "maintenance", "viewer"];
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role" };
  }

  const supabase = await createClient();

  // Get the target user to ensure they're in the same organization
  const { data: targetUser, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError || !targetUser) {
    return { error: "User not found" };
  }

  if (targetUser.organization_id !== currentUser.organizationId) {
    return { error: "User not in your organization" };
  }

  // Prevent removing the last owner
  if (targetUser.role === "owner" && newRole !== "owner") {
    const { data: owners } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", currentUser.organizationId)
      .eq("role", "owner");

    if (owners && owners.length <= 1) {
      return { error: "Cannot remove the last owner. Promote another user to owner first." };
    }
  }

  // Update the role
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard/organization");
  return { success: true };
}

/**
 * Remove a user from the organization (owner only)
 */
export async function removeUserFromOrganization(userId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Unauthorized" };
  }

  // Only owners can remove users
  if (currentUser.role !== "owner") {
    return { error: "Only owners can remove users" };
  }

  const supabase = await createClient();

  // Get the target user
  const { data: targetUser, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError || !targetUser) {
    return { error: "User not found" };
  }

  if (targetUser.organization_id !== currentUser.organizationId) {
    return { error: "User not in your organization" };
  }

  // Prevent removing yourself
  if (targetUser.id === currentUser.id) {
    return { error: "You cannot remove yourself" };
  }

  // Prevent removing the last owner
  if (targetUser.role === "owner") {
    const { data: owners } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", currentUser.organizationId)
      .eq("role", "owner");

    if (owners && owners.length <= 1) {
      return { error: "Cannot remove the last owner" };
    }
  }

  // For now, we'll just update them to have a different organization_id
  // In a real app, you might delete their profile or handle this differently
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ organization_id: `removed_${Date.now()}` })
    .eq("id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard/organization");
  return { success: true };
}
