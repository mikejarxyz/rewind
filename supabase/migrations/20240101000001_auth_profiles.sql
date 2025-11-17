-- User signup automation
-- Automatically creates profile and organization for new users

-- =====================================================
-- SIGNUP AUTOMATION
-- =====================================================

-- Function to create a profile and organization on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id TEXT;
BEGIN
    -- Generate a new organization ID for the user
    new_org_id := 'org_' || gen_random_uuid()::text;

    -- Create profile with new organization
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

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile and organization for new users';
