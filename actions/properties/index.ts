"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { properties, units } from "@/lib/db/schema/properties";
import { propertySchema, unitSchema } from "@/lib/validations/properties";
import { getUser } from "@/actions/auth";
import { eq, desc } from "drizzle-orm";

// Properties Actions

export async function createProperty(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const data = {
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country") || "USA",
    propertyType: formData.get("propertyType"),
    numberOfUnits: formData.get("numberOfUnits") || 1,
    yearBuilt: formData.get("yearBuilt") || null,
    squareFeet: formData.get("squareFeet") || null,
    lotSize: formData.get("lotSize") || null,
    purchasePrice: formData.get("purchasePrice") || null,
    purchaseDate: formData.get("purchaseDate") || null,
    currentValue: formData.get("currentValue") || null,
    status: formData.get("status") || "active",
    notes: formData.get("notes") || null,
  };

  const validation = propertySchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const [property] = await db
      .insert(properties)
      .values({
        ...validation.data,
        squareFeet: validation.data.squareFeet?.toString() ?? null,
        lotSize: validation.data.lotSize?.toString() ?? null,
        purchasePrice: validation.data.purchasePrice?.toString() ?? null,
        currentValue: validation.data.currentValue?.toString() ?? null,
        purchaseDate: validation.data.purchaseDate ? new Date(validation.data.purchaseDate) : null,
        createdBy: user.id,
        updatedBy: user.id,
      })
      .returning();

    revalidatePath("/dashboard/properties");
    return { success: true, property };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { error: "Failed to create property" };
  }
}

export async function updateProperty(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const data = {
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country") || "USA",
    propertyType: formData.get("propertyType"),
    numberOfUnits: formData.get("numberOfUnits") || 1,
    yearBuilt: formData.get("yearBuilt") || null,
    squareFeet: formData.get("squareFeet") || null,
    lotSize: formData.get("lotSize") || null,
    purchasePrice: formData.get("purchasePrice") || null,
    purchaseDate: formData.get("purchaseDate") || null,
    currentValue: formData.get("currentValue") || null,
    status: formData.get("status") || "active",
    notes: formData.get("notes") || null,
  };

  const validation = propertySchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const [property] = await db
      .update(properties)
      .set({
        ...validation.data,
        squareFeet: validation.data.squareFeet?.toString() ?? null,
        lotSize: validation.data.lotSize?.toString() ?? null,
        purchasePrice: validation.data.purchasePrice?.toString() ?? null,
        currentValue: validation.data.currentValue?.toString() ?? null,
        purchaseDate: validation.data.purchaseDate ? new Date(validation.data.purchaseDate) : null,
        updatedBy: user.id,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    if (!property) {
      return { error: "Property not found" };
    }

    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${id}`);
    return { success: true, property };
  } catch (error) {
    console.error("Failed to update property:", error);
    return { error: "Failed to update property" };
  }
}

export async function deleteProperty(id: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(properties).where(eq(properties.id, id));

    revalidatePath("/dashboard/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { error: "Failed to delete property" };
  }
}

export async function getProperties() {
  try {
    const allProperties = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));

    return { properties: allProperties };
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return { error: "Failed to fetch properties", properties: [] };
  }
}

export async function getPropertyById(id: string) {
  try {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (!property) {
      return { error: "Property not found" };
    }

    return { property };
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return { error: "Failed to fetch property" };
  }
}

// Units Actions

export async function createUnit(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const data = {
    propertyId: formData.get("propertyId"),
    unitNumber: formData.get("unitNumber"),
    floor: formData.get("floor") || null,
    bedrooms: formData.get("bedrooms") || 0,
    bathrooms: formData.get("bathrooms") || 1,
    squareFeet: formData.get("squareFeet") || null,
    monthlyRent: formData.get("monthlyRent") || null,
    securityDeposit: formData.get("securityDeposit") || null,
    status: formData.get("status") || "vacant",
    isAvailable: formData.get("isAvailable") === "true",
    features: formData.get("features") || null,
    notes: formData.get("notes") || null,
  };

  const validation = unitSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: "Validation failed",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const [unit] = await db
      .insert(units)
      .values({
        ...validation.data,
        bathrooms: validation.data.bathrooms.toString(),
        squareFeet: validation.data.squareFeet?.toString() ?? null,
        monthlyRent: validation.data.monthlyRent?.toString() ?? null,
        securityDeposit: validation.data.securityDeposit?.toString() ?? null,
        createdBy: user.id,
        updatedBy: user.id,
      })
      .returning();

    revalidatePath(`/dashboard/properties/${validation.data.propertyId}`);
    return { success: true, unit };
  } catch (error) {
    console.error("Failed to create unit:", error);
    return { error: "Failed to create unit" };
  }
}

export async function getUnitsByPropertyId(propertyId: string) {
  try {
    const propertyUnits = await db
      .select()
      .from(units)
      .where(eq(units.propertyId, propertyId))
      .orderBy(units.unitNumber);

    return { units: propertyUnits };
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return { error: "Failed to fetch units", units: [] };
  }
}
