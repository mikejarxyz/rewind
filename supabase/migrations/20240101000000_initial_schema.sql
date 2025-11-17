-- Initial schema for property management app
-- Includes: tables, indexes, RLS policies, and triggers

-- =====================================================
-- EXTENSIONS
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TABLES
-- =====================================================

-- User profiles table (must be created first for helper functions)
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

-- Indexes for profiles
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Helper function to get current user's organization_id
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS TEXT AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =====================================================
-- PROPERTIES, UNITS, PEOPLE TABLES
-- =====================================================

-- Properties table
CREATE TABLE properties (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    property_type VARCHAR(50) NOT NULL,
    number_of_units INTEGER NOT NULL DEFAULT 1,
    year_built INTEGER,
    square_feet DECIMAL(10, 2),
    lot_size DECIMAL(10, 2),
    purchase_price DECIMAL(12, 2),
    purchase_date DATE,
    current_value DECIMAL(12, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    organization_id TEXT NOT NULL,

    -- Constraints
    CONSTRAINT property_type_check CHECK (property_type IN ('residential', 'commercial', 'mixed-use')),
    CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'sold')),
    CONSTRAINT number_of_units_positive CHECK (number_of_units > 0)
);

-- Units table
CREATE TABLE units (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    floor VARCHAR(50),
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms DECIMAL(3, 1) NOT NULL DEFAULT 1.0,
    square_feet DECIMAL(10, 2),
    monthly_rent DECIMAL(10, 2),
    security_deposit DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'vacant',
    is_available BOOLEAN NOT NULL DEFAULT true,
    features TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    organization_id TEXT NOT NULL,

    -- Foreign keys
    CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT unit_status_check CHECK (status IN ('vacant', 'occupied', 'maintenance', 'reserved')),
    CONSTRAINT bedrooms_non_negative CHECK (bedrooms >= 0),
    CONSTRAINT bathrooms_positive CHECK (bathrooms > 0)
);

-- People table
CREATE TABLE people (
    id TEXT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    type VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    vendor_category VARCHAR(100),
    license_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    organization_id TEXT NOT NULL,

    -- Constraints
    CONSTRAINT person_type_check CHECK (type IN ('tenant', 'landlord', 'vendor', 'contact')),
    CONSTRAINT person_status_check CHECK (status IN ('active', 'inactive'))
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Properties indexes
CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Units indexes
CREATE INDEX idx_units_organization_id ON units(organization_id);
CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_is_available ON units(is_available);
CREATE INDEX idx_units_unit_number ON units(unit_number);

-- People indexes
CREATE INDEX idx_people_organization_id ON people(organization_id);
CREATE INDEX idx_people_type ON people(type);
CREATE INDEX idx_people_status ON people(status);
CREATE INDEX idx_people_email ON people(email);
CREATE INDEX idx_people_created_at ON people(created_at DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at
    BEFORE UPDATE ON people
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Properties RLS policies
CREATE POLICY "Users can view properties in their organization"
    ON properties FOR SELECT
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert properties in their organization"
    ON properties FOR INSERT
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update properties in their organization"
    ON properties FOR UPDATE
    USING (organization_id = get_user_organization_id())
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete properties in their organization"
    ON properties FOR DELETE
    USING (organization_id = get_user_organization_id());

-- Units RLS policies
CREATE POLICY "Users can view units in their organization"
    ON units FOR SELECT
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert units in their organization"
    ON units FOR INSERT
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update units in their organization"
    ON units FOR UPDATE
    USING (organization_id = get_user_organization_id())
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete units in their organization"
    ON units FOR DELETE
    USING (organization_id = get_user_organization_id());

-- People RLS policies
CREATE POLICY "Users can view people in their organization"
    ON people FOR SELECT
    USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert people in their organization"
    ON people FOR INSERT
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update people in their organization"
    ON people FOR UPDATE
    USING (organization_id = get_user_organization_id())
    WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete people in their organization"
    ON people FOR DELETE
    USING (organization_id = get_user_organization_id());

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles can be created during signup"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE profiles IS 'User profiles with organization membership and role information';
COMMENT ON TABLE properties IS 'Stores property information for the property management system';
COMMENT ON TABLE units IS 'Stores individual unit information within properties';
COMMENT ON TABLE people IS 'Stores information for tenants, landlords, vendors, and contacts';

COMMENT ON FUNCTION get_user_organization_id() IS 'Returns the organization_id from the current user';
COMMENT ON FUNCTION get_user_role() IS 'Returns the role of the current user';
COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at timestamp when a row is modified';
