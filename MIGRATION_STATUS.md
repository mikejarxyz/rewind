# Drizzle to Supabase Migration Status

## ✅ Completed

1. **SQL Migrations Created**
   - `/supabase/migrations/20240101000000_initial_schema.sql` - Complete schema with RLS
   - `/supabase/migrations/20240101000001_auth_profiles.sql` - User profiles and organization setup

2. **Supabase Client Setup**
   - Created `/lib/supabase/server.ts` with type-safe client
   - Added `getCurrentUser()` helper with profile information

3. **TypeScript Types**
   - Generated `/types/supabase.ts` with database types
   - Created `/types/database.ts` with re-exported types (Property, Unit, Person, Profile)

4. **Server Actions Converted**
   - `/actions/properties/index.ts` - Uses Supabase client ✓
   - `/actions/people/index.ts` - Uses Supabase client ✓
   - `/actions/auth/index.ts` - Already using Supabase client ✓

5. **Drizzle Removed**
   - Deleted `/lib/db/` directory
   - Removed `drizzle.config.ts`
   - Removed Drizzle dependencies from `package.json`
   - Updated all type imports from `/lib/db/schema/*` to `/types/database`

6. **Documentation**
   - Created `/supabase/README.md` with setup instructions

## ⚠️ Remaining Work

### Field Name Conversions

All UI components need to be updated to use snake_case field names (from database) instead of camelCase:

**People Module:**
- `firstName` → `first_name`
- `lastName` → `last_name`
- `companyName` → `company_name`
- `alternatePhone` → `alternate_phone`
- `zipCode` → `zip_code`
- `emergencyContactName` → `emergency_contact_name`
- `emergencyContactPhone` → `emergency_contact_phone`
- `emergencyContactRelationship` → `emergency_contact_relationship`
- `vendorCategory` → `vendor_category`
- `licenseNumber` → `license_number`

**Properties Module:**
- `propertyType` → `property_type`
- `numberOfUnits` → `number_of_units`
- `yearBuilt` → `year_built`
- `squareFeet` → `square_feet`
- `lotSize` → `lot_size`
- `purchasePrice` → `purchase_price`
- `purchaseDate` → `purchase_date`
- `currentValue` → `current_value`
- `zipCode` → `zip_code`

**Units Module:**
- `propertyId` → `property_id`
- `unitNumber` → `unit_number`
- `squareFeet` → `square_feet`
- `monthlyRent` → `monthly_rent`
- `securityDeposit` → `security_deposit`
- `isAvailable` → `is_available`

### Files Needing Updates

1. `/app/(dashboard)/dashboard/people/person-form.tsx`
2. `/app/(dashboard)/dashboard/people/people-table.tsx`
3. `/app/(dashboard)/dashboard/people/[id]/page.tsx`
4. `/app/(dashboard)/dashboard/people/[id]/edit/page.tsx`
5. `/app/(dashboard)/dashboard/properties/property-form.tsx`
6. `/app/(dashboard)/dashboard/properties/properties-table.tsx`
7. `/app/(dashboard)/dashboard/properties/[id]/page.tsx`
8. `/app/(dashboard)/dashboard/properties/[id]/units-table.tsx`
9. `/app/(dashboard)/dashboard/properties/[id]/units/unit-form.tsx`

### Quick Fix Script

Run this to convert all field names in UI components:

```bash
# People fields
find app -name "*.tsx" -exec sed -i \
  -e 's/person\.firstName/person.first_name/g' \
  -e 's/person\.lastName/person.last_name/g' \
  -e 's/person\.companyName/person.company_name/g' \
  -e 's/person\.alternatePhone/person.alternate_phone/g' \
  -e 's/person\.zipCode/person.zip_code/g' \
  -e 's/person\.emergencyContactName/person.emergency_contact_name/g' \
  -e 's/person\.emergencyContactPhone/person.emergency_contact_phone/g' \
  -e 's/person\.emergencyContactRelationship/person.emergency_contact_relationship/g' \
  -e 's/person\.vendorCategory/person.vendor_category/g' \
  -e 's/person\.licenseNumber/person.license_number/g' \
  {} +

# Properties fields
find app -name "*.tsx" -exec sed -i \
  -e 's/property\.propertyType/property.property_type/g' \
  -e 's/property\.numberOfUnits/property.number_of_units/g' \
  -e 's/property\.yearBuilt/property.year_built/g' \
  -e 's/property\.squareFeet/property.square_feet/g' \
  -e 's/property\.lotSize/property.lot_size/g' \
  -e 's/property\.purchasePrice/property.purchase_price/g' \
  -e 's/property\.purchaseDate/property.purchase_date/g' \
  -e 's/property\.currentValue/property.current_value/g' \
  -e 's/property\.zipCode/property.zip_code/g' \
  {} +

# Units fields
find app -name "*.tsx" -exec sed -i \
  -e 's/unit\.propertyId/unit.property_id/g' \
  -e 's/unit\.unitNumber/unit.unit_number/g' \
  -e 's/unit\.squareFeet/unit.square_feet/g' \
  -e 's/unit\.monthlyRent/unit.monthly_rent/g' \
  -e 's/unit\.securityDeposit/unit.security_deposit/g' \
  -e 's/unit\.isAvailable/unit.is_available/g' \
  {} +
```

## Next Steps

1. Run the field name conversion script above
2. Run `pnpm build` to check for remaining type errors
3. Run migrations: `supabase db push` (or manually via dashboard)
4. Regenerate types: `supabase gen types typescript > types/supabase.ts`
5. Remove `@ts-ignore` comments from server actions
6. Test all CRUD operations

## Notes

- Type errors with `@ts-ignore` comments are temporary
- Once migrations run and types regenerate, remove all `@ts-ignore` comments
- RLS policies are in place and will automatically filter by organization_id
- First user signup auto-creates organization with owner role
