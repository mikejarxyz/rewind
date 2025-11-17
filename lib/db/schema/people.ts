import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const people = pgTable("people", {
  id: text("id").primaryKey().$defaultFn(() => createId()),

  // Basic Information
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  alternatePhone: varchar("alternate_phone", { length: 20 }),

  // Person Type
  type: varchar("type", { length: 50 }).notNull(), // tenant, landlord, vendor, contact

  // Company Information (for vendors/landlords)
  companyName: varchar("company_name", { length: 255 }),

  // Address
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),

  // Emergency Contact (for tenants)
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
  emergencyContactRelationship: varchar("emergency_contact_relationship", { length: 100 }),

  // Additional Details
  notes: text("notes"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, inactive

  // Vendor-specific
  vendorCategory: varchar("vendor_category", { length: 100 }), // plumber, electrician, hvac, etc.
  licenseNumber: varchar("license_number", { length: 100 }),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
  organizationId: text("organization_id"), // For multi-tenancy later
});

export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
