import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required").max(255),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(50),
  zipCode: z.string().min(1, "ZIP code is required").max(20),
  country: z.string().min(1).max(100).default("USA"),

  propertyType: z.enum(["residential", "commercial", "mixed-use"]),
  numberOfUnits: z.coerce.number().int().min(1).default(1),
  yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  squareFeet: z.coerce.number().positive().optional().nullable(),
  lotSize: z.coerce.number().positive().optional().nullable(),

  purchasePrice: z.coerce.number().positive().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  currentValue: z.coerce.number().positive().optional().nullable(),

  status: z.enum(["active", "inactive", "sold"]).default("active"),
  notes: z.string().optional().nullable(),
});

export const unitSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  unitNumber: z.string().min(1, "Unit number is required").max(50),
  floor: z.coerce.number().int().optional().nullable(),
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(1),
  squareFeet: z.coerce.number().positive().optional().nullable(),

  monthlyRent: z.coerce.number().positive().optional().nullable(),
  securityDeposit: z.coerce.number().positive().optional().nullable(),

  status: z.enum(["vacant", "occupied", "maintenance"]).default("vacant"),
  isAvailable: z.boolean().default(true),

  features: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
