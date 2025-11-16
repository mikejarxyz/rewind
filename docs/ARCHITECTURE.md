# Rewind - Property Management Super-App
## Architectural Reference

**Status:** Phase 1 - Foundation & Scaffolding
**Last Updated:** 2025-11-16

---

## Project Overview

A comprehensive property management ERP system designed to streamline the entire property management workflow for property managers, landlords, maintenance staff, and accountants.

### Project Name
**Current:** Rewind (placeholder)

**Name Suggestions:**
- PropCore
- EstateFlow
- ManageStack
- PropertyOS
- TenantBase
- BuildingHub
- RentStream
- PropStack

---

## Tech Stack

### Core Framework
- **Next.js 14+** - App Router with React Server Components
- **TypeScript** - Strict mode enabled
- **Node.js** - v22.16.0 (considering upgrade to v24.11.1)
- **Package Manager** - pnpm

### Frontend
- **React 18+** - Server Components + Client Components (hybrid approach)
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Server state management (minimal use)
- **Zustand** - Client state management (minimal use)

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication (Email/Password, OAuth providers)
  - Storage Buckets (file storage)
  - Row Level Security (RLS)
- **Drizzle ORM** - Type-safe database abstraction layer
- **Server Actions** - Primary data mutation strategy

### Development & Testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Playwright** - End-to-end testing
- **TypeScript** - Type checking

### Deployment
- **Vercel** - Primary deployment platform
- Self-hosting option available for enterprise clients

---

## Architecture Decisions

### Rendering Strategy
**Hybrid Server-Side & Client-Side Rendering:**

**Server-Side (Default):**
- Page shells and layouts
- Initial data loading
- Navigation and static sections
- Leverages React Server Components

**Client-Side (When Needed):**
- Interactive tables (sorting, filtering, pagination)
- Forms with real-time validation
- Modals, dropdowns, popovers
- Charts and visualizations

**Data Flow:**
- Server Components by default
- Server Actions for mutations
- Streaming with Suspense for slow queries
- TanStack Query only for polling/refetching scenarios

### Authentication & Authorization
- **Supabase Auth** - Email/password + OAuth (Google planned)
- **Row Level Security (RLS)** - Database-level security
- **Role-Based Access Control (RBAC):**
  - Owner (ultimate admin)
  - Property Manager
  - Bookkeeper
  - Maintenance Staff
  - Future: Custom roles with granular permissions

### Multi-Tenancy (Future Phase)
- **Current:** Single-instance deployment
- **Future:** SaaS layer with isolated tenant data
- Architecture designed to support multi-tenancy migration

### File Storage
- **Supabase Storage Buckets** - Primary storage
- Versioning enabled for contracts/leases
- Easily swappable with other providers (S3, etc.)

---

## Project Structure

```
/rewind
├── docs/                       # Documentation
│   └── ARCHITECTURE.md        # This file
├── drizzle/                   # Database migrations
│   ├── migrations/
│   └── schema.ts
├── public/                    # Static assets
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   │   ├── layout.tsx    # Dashboard shell & navigation
│   │   │   ├── page.tsx      # Dashboard home
│   │   │   ├── properties/   # Properties module
│   │   │   ├── people/       # People/Clients module
│   │   │   ├── accounting/   # Accounting module
│   │   │   ├── employees/    # Employees module
│   │   │   └── settings/     # Settings & permissions
│   │   ├── api/              # API routes (if needed)
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing/home page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── forms/            # Reusable form components
│   │   ├── tables/           # Data table components
│   │   ├── layouts/          # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── dashboard-shell.tsx
│   │   └── providers/        # Context providers
│   ├── lib/
│   │   ├── db/               # Database layer
│   │   │   ├── schema/       # Drizzle schemas by module
│   │   │   ├── queries/      # Reusable queries
│   │   │   └── migrations/   # Migration utilities
│   │   ├── supabase/         # Supabase configuration
│   │   │   ├── client.ts     # Client-side client
│   │   │   ├── server.ts     # Server-side client
│   │   │   └── middleware.ts # Auth middleware
│   │   ├── auth/             # Authentication helpers
│   │   │   ├── session.ts
│   │   │   └── permissions.ts
│   │   ├── validations/      # Zod schemas
│   │   │   ├── properties.ts
│   │   │   ├── people.ts
│   │   │   └── accounting.ts
│   │   └── utils/            # Utility functions
│   │       ├── cn.ts         # Class name utilities
│   │       ├── date.ts       # Date formatting
│   │       └── format.ts     # Data formatting
│   ├── hooks/                # Custom React hooks
│   │   ├── use-user.ts
│   │   └── use-permissions.ts
│   ├── stores/               # Zustand stores (minimal)
│   │   └── ui-store.ts       # UI state only
│   ├── types/                # TypeScript type definitions
│   │   ├── database.ts       # Database types
│   │   ├── supabase.ts       # Supabase generated types
│   │   └── index.ts          # Shared types
│   └── actions/              # Server Actions
│       ├── properties/
│       ├── people/
│       └── accounting/
├── tests/
│   ├── unit/                 # Jest unit tests
│   └── e2e/                  # Playwright E2E tests
├── .env.local                # Environment variables (gitignored)
├── .env.example              # Environment template
├── drizzle.config.ts         # Drizzle configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── package.json
├── pnpm-lock.yaml
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## Core Modules (Phase 2+)

### 1. People / Clients
- Tenants (with notices, maintenance requests)
- Contacts
- Companies
- Leases
- Occupancy Costs (AR, invoices)

### 2. Properties
- Properties
- Units within properties
- Assets within units
- Inspections
- Expenses (utilities, maintenance)

### 3. Accounting / Legal
- Contracts & Leases
- Accounts Receivable (AR - invoices)
- Accounts Payable (AP - invoices, receipts)
- Expenses (utilities, maintenance)
- Work Orders
- Payroll

### 4. Employees
- SOPs & Training
- Payroll

---

## Features Roadmap

### Phase 1: Foundation (Current)
- [ ] Project scaffolding
- [ ] Authentication system
- [ ] Dashboard shell with navigation
- [ ] Role-based permissions framework
- [ ] Basic UI component library setup

### Phase 2: Core Modules
- [ ] Properties module
- [ ] People/Clients module
- [ ] Basic CRUD operations
- [ ] File upload functionality

### Phase 3: Business Logic
- [ ] Accounting module
- [ ] Lease management
- [ ] Invoice generation
- [ ] Expense tracking

### Phase 4: Automation & Advanced Features
- [ ] Automated invoice generation
- [ ] Lease renewal notifications
- [ ] SMS/Email notifications
- [ ] PDF generation from templates
- [ ] Reporting & analytics
- [ ] Forms (tenancy applications, maintenance requests)
- [ ] Contract signing workflow

### Phase 5: Multi-Tenancy (Future)
- [ ] SaaS layer architecture
- [ ] Tenant isolation
- [ ] White-labeling capabilities
- [ ] Billing system

---

## Data Model Considerations

### Key Relationships
```
Owner (1) ──> (N) Properties
Property (1) ──> (N) Units
Unit (1) ──> (N) Assets
Unit (1) ──> (N) Leases
Lease (N) ──> (N) Tenants
Property (1) ──> (N) Expenses
Property (1) ──> (N) WorkOrders
Tenant (1) ──> (N) Invoices
```

### Audit Trail
- All critical tables should have:
  - `created_at`
  - `updated_at`
  - `created_by` (user reference)
  - `updated_by` (user reference)

### Document Versioning
- Contracts, leases, and legal documents require version tracking
- Store versions in separate table with foreign key relationship

---

## Security Considerations

### Row Level Security (RLS)
- Implement RLS policies for all tables
- User can only access data within their organization
- Role-based read/write restrictions

### Authentication
- Secure session management
- JWT tokens with rotation
- Password requirements enforcement
- Optional 2FA (future)

### File Storage
- Signed URLs for temporary access
- Storage policies based on user roles
- Virus scanning (future consideration)

---

## Performance Optimizations

### Database
- Proper indexing on foreign keys
- Composite indexes for common queries
- Pagination for large datasets

### Frontend
- Code splitting by route
- Image optimization (Next.js Image)
- Lazy loading for heavy components
- Server-side rendering for SEO

### Caching
- Server component caching
- TanStack Query caching (when used)
- CDN for static assets

---

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `claude/*` - AI-assisted development branches

### Code Quality
- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting
- Pre-commit hooks (Husky)
- Unit tests required for business logic
- E2E tests for critical user flows

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Deployment Strategy

### Vercel (Primary)
- Automatic deployments from `main` branch
- Preview deployments for PRs
- Environment variables managed in Vercel dashboard

### Self-Hosting (Enterprise Option)
- Docker containerization (future)
- Environment variable management
- Database migration strategy
- Backup procedures

---

## Future Considerations

### Scalability
- Database connection pooling
- Redis for caching (if needed)
- Background job processing (for automated workflows)
- Email queue management

### Integrations
- Payment processors (Stripe, PayPal)
- Accounting software (QuickBooks, Xero)
- Background check services
- E-signature providers (DocuSign, HelloSign)

### Mobile
- Progressive Web App (PWA) first
- Native mobile app (React Native) - if demand exists

---

## Notes

- Keep the codebase modular for easy extraction into monorepo packages later
- Document all custom hooks and utilities
- Maintain this architecture doc as source of truth
- Update roadmap phases as features are completed
