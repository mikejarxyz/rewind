import { pgTable, text, varchar, timestamp, integer, decimal, boolean, uuid } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const properties = pgTable("properties", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull().default("USA"),

  // Property details
  propertyType: varchar("property_type", { length: 50 }).notNull(), // residential, commercial, mixed-use
  numberOfUnits: integer("number_of_units").notNull().default(1),
  yearBuilt: integer("year_built"),
  squareFeet: decimal("square_feet", { precision: 10, scale: 2 }),
  lotSize: decimal("lot_size", { precision: 10, scale: 2 }),

  // Financial
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  purchaseDate: timestamp("purchase_date"),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }),

  // Status
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, inactive, sold
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
});

export const units = pgTable("units", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  // Unit details
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  floor: integer("floor"),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }).notNull().default("1.0"),
  squareFeet: decimal("square_feet", { precision: 10, scale: 2 }),

  // Rental information
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),

  // Status
  status: varchar("status", { length: 50 }).notNull().default("vacant"), // vacant, occupied, maintenance
  isAvailable: boolean("is_available").notNull().default(true),

  // Features
  features: text("features"), // JSON string of features
  notes: text("notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
