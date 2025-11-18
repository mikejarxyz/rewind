'use server'

import { createClient } from '@/lib/supabase/server'
import { canManageRoles } from '@/lib/auth/permissions'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

export interface Invitation {
  id: string
  email: string
  organization_id: string
  invited_by: string
  role: string
  token: string
  status: 'pending' | 'accepted' | 'expired'
  expires_at: string
  created_at: string
  accepted_at: string | null
}

/**
 * Create a new invitation
 */
export async function createInvitation(email: string, role: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get user profile to check permissions
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Could not fetch user profile' }
  }

  // Check if user has permission to invite
  if (!canManageRoles(profile.role)) {
    return { success: false, error: 'You do not have permission to invite users' }
  }

  // Validate role
  const validRoles = ['owner', 'property_manager', 'bookkeeper', 'maintenance', 'viewer']
  if (!validRoles.includes(role)) {
    return { success: false, error: 'Invalid role' }
  }

  // Check if user with this email already exists in the organization
  const { data: existingUser, error: existingUserError } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .eq('organization_id', profile.organization_id)
    .single()

  if (existingUser) {
    return { success: false, error: 'User with this email is already in your organization' }
  }

  // Check if there's already a pending invitation for this email
  const { data: existingInvitation } = await supabase
    .from('invitations')
    .select('status')
    .eq('email', email)
    .eq('organization_id', profile.organization_id)
    .eq('status', 'pending')
    .single()

  if (existingInvitation) {
    return { success: false, error: 'An invitation has already been sent to this email' }
  }

  // Generate a secure random token
  const token = randomBytes(32).toString('hex')

  // Create invitation
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .insert({
      email,
      organization_id: profile.organization_id,
      invited_by: user.id,
      role,
      token,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select()
    .single()

  if (invitationError) {
    console.error('Error creating invitation:', invitationError)
    return { success: false, error: 'Failed to create invitation' }
  }

  // TODO: Send invitation email here
  // For now, we'll just return the invitation URL
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`

  revalidatePath('/dashboard/organization')

  return {
    success: true,
    invitation,
    invitationUrl,
  }
}

/**
 * Get all invitations for the current user's organization
 */
export async function getOrganizationInvitations() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated', data: [] }
  }

  const { data: invitations, error } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invitations:', error)
    return { success: false, error: 'Failed to fetch invitations', data: [] }
  }

  return { success: true, data: invitations as Invitation[] }
}

/**
 * Cancel (delete) an invitation
 */
export async function cancelInvitation(invitationId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get user profile to check permissions
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Could not fetch user profile' }
  }

  // Check if user has permission
  if (!canManageRoles(profile.role)) {
    return { success: false, error: 'You do not have permission to cancel invitations' }
  }

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)

  if (error) {
    console.error('Error canceling invitation:', error)
    return { success: false, error: 'Failed to cancel invitation' }
  }

  revalidatePath('/dashboard/organization')

  return { success: true }
}

/**
 * Resend an invitation (generates new token and extends expiry)
 */
export async function resendInvitation(invitationId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get user profile to check permissions
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Could not fetch user profile' }
  }

  // Check if user has permission
  if (!canManageRoles(profile.role)) {
    return { success: false, error: 'You do not have permission to resend invitations' }
  }

  // Generate new token
  const token = randomBytes(32).toString('hex')

  // Update invitation with new token and extended expiry
  const { data: invitation, error } = await supabase
    .from('invitations')
    .update({
      token,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', invitationId)
    .select()
    .single()

  if (error) {
    console.error('Error resending invitation:', error)
    return { success: false, error: 'Failed to resend invitation' }
  }

  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`

  revalidatePath('/dashboard/organization')

  return {
    success: true,
    invitation,
    invitationUrl,
  }
}

/**
 * Get invitation by token (public - no auth required)
 */
export async function getInvitationByToken(token: string) {
  const supabase = await createClient()

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (error || !invitation) {
    return { success: false, error: 'Invalid or expired invitation' }
  }

  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    return { success: false, error: 'This invitation has expired' }
  }

  return { success: true, data: invitation as Invitation }
}
