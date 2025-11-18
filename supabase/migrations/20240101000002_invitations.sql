-- Create invitations table for invite-only user registration
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'property_manager', 'bookkeeper', 'maintenance', 'viewer')),
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(email, organization_id)
);

-- Add index for faster lookups
CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_email ON public.invitations(email);
CREATE INDEX idx_invitations_organization_id ON public.invitations(organization_id);
CREATE INDEX idx_invitations_status ON public.invitations(status);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
-- Users can view invitations for their organization
CREATE POLICY "Users can view their organization's invitations"
  ON public.invitations
  FOR SELECT
  USING (organization_id = public.get_user_organization_id());

-- Only owners can create invitations
CREATE POLICY "Owners can create invitations"
  ON public.invitations
  FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_organization_id()
    AND public.get_user_role() = 'owner'
  );

-- Only owners can update invitations (e.g., to cancel/expire them)
CREATE POLICY "Owners can update invitations"
  ON public.invitations
  FOR UPDATE
  USING (
    organization_id = public.get_user_organization_id()
    AND public.get_user_role() = 'owner'
  );

-- Only owners can delete invitations
CREATE POLICY "Owners can delete invitations"
  ON public.invitations
  FOR DELETE
  USING (
    organization_id = public.get_user_organization_id()
    AND public.get_user_role() = 'owner'
  );

-- Function to accept invitation and create user profile
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT, user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  result JSONB;
BEGIN
  -- Get the invitation
  SELECT * INTO invitation_record
  FROM public.invitations
  WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > NOW();

  -- Check if invitation exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  -- Create user profile
  INSERT INTO public.profiles (id, organization_id, role, email)
  VALUES (
    user_id,
    invitation_record.organization_id,
    invitation_record.role,
    invitation_record.email
  );

  -- Update invitation status
  UPDATE public.invitations
  SET status = 'accepted',
      accepted_at = NOW()
  WHERE token = invitation_token;

  result := jsonb_build_object(
    'success', true,
    'organization_id', invitation_record.organization_id,
    'role', invitation_record.role
  );

  RETURN result;
END;
$$;

-- Function to clean up expired invitations (can be called by a cron job)
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();

  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$;
