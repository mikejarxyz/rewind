# Supabase Setup

This project uses Supabase for backend services including database, authentication, and RLS.

## Initial Setup

1. Create a Supabase project at https://supabase.com
2. Copy your project credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=your-database-connection-string
   ```

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push

# Generate TypeScript types from your database
supabase gen types typescript --local > types/supabase.ts
```

### Option 2: Manual via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file from `supabase/migrations/` in order
4. Execute each migration

## Regenerating Types

After running migrations or making schema changes, regenerate TypeScript types:

```bash
# If using local Supabase
supabase gen types typescript --local > types/supabase.ts

# If using remote project
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

## Migrations

Migrations are located in `supabase/migrations/` and should be run in order:

1. `20240101000000_initial_schema.sql` - Creates tables, indexes, RLS policies, triggers
2. `20240101000001_auth_profiles.sql` - Sets up user profiles and organization management

## Row Level Security (RLS)

All tables have RLS enabled. Policies are automatically enforced based on:
- User's `organization_id` from their profile
- User's role (owner, property_manager, bookkeeper, maintenance, viewer)

## Database Schema

### Tables

- **properties** - Property information
- **units** - Unit/apartment information
- **people** - Tenants, landlords, vendors, and contacts
- **profiles** - User profiles with organization membership

### Functions

- `auth.user_organization_id()` - Returns current user's organization ID
- `auth.user_role()` - Returns current user's role
- `update_updated_at_column()` - Automatically updates `updated_at` timestamps

## Development Workflow

1. Make schema changes in SQL migration files
2. Run migrations with `supabase db push`
3. Regenerate types with `supabase gen types typescript`
4. Commit both migration files and updated types

## Notes

- The initial types in `types/supabase.ts` are manually created templates
- Once you run migrations, regenerate types using the Supabase CLI
- Organization ID is automatically assigned when users sign up
- First user in an organization is automatically assigned the "owner" role
