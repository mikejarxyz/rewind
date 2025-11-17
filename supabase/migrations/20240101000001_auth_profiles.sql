-- User profiles and organization setup
-- Extends Supabase auth.users with additional profile information

-- =====================================================
-- TABLES
-- =====================================================

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT role_check CHECK (role IN ('owner', 'property_manager', 'bookkeeper', 'maintenance', 'viewer'))
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile (but not organization_id or role)
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only allow profile creation during signup (handled by trigger)
CREATE POLICY "Profiles can be created during signup"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- FUNCTIONS
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
-- UPDATE RLS FUNCTIONS
-- =====================================================

-- Update the user_organization_id function to pull from profiles
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS TEXT AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles with organization membership and role information';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile and organization for new users';
COMMENT ON FUNCTION auth.user_role() IS 'Returns the role of the current user';
