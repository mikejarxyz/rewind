-- Update signup automation to handle invitation-based signups
-- This replaces the previous handle_new_user function to work with invitations

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Updated function that checks for invitation token
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id TEXT;
    invitation_token TEXT;
BEGIN
    -- Check if user signed up with an invitation token
    invitation_token := NEW.raw_user_meta_data->>'invitation_token';

    -- If there's an invitation token, the accept_invitation function will create the profile
    -- So we don't create anything here
    IF invitation_token IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- For direct signups (system admin creating first user via Supabase)
    -- Generate a new organization ID for the user
    new_org_id := 'org_' || gen_random_uuid()::text;

    -- Create profile with new organization and owner role
    INSERT INTO public.profiles (id, organization_id, role, email)
    VALUES (
        NEW.id,
        new_org_id,
        'owner', -- First user is always owner
        NEW.email
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile and organization for new users (unless signing up via invitation)';
