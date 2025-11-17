import { z } from "zod";

export const personSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  phone: z.string().max(20).optional().nullable().or(z.literal("")),
  alternatePhone: z.string().max(20).optional().nullable().or(z.literal("")),

  type: z.enum(["tenant", "landlord", "vendor", "contact"]),

  companyName: z.string().max(255).optional().nullable().or(z.literal("")),

  address: z.string().optional().nullable().or(z.literal("")),
  city: z.string().max(100).optional().nullable().or(z.literal("")),
  state: z.string().max(50).optional().nullable().or(z.literal("")),
  zipCode: z.string().max(20).optional().nullable().or(z.literal("")),

  emergencyContactName: z.string().max(200).optional().nullable().or(z.literal("")),
  emergencyContactPhone: z.string().max(20).optional().nullable().or(z.literal("")),
  emergencyContactRelationship: z.string().max(100).optional().nullable().or(z.literal("")),

  notes: z.string().optional().nullable().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),

  vendorCategory: z.string().max(100).optional().nullable().or(z.literal("")),
  licenseNumber: z.string().max(100).optional().nullable().or(z.literal("")),
});

export type PersonFormData = z.infer<typeof personSchema>;
