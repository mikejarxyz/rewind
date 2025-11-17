"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { propertySchema, unitSchema } from "@/lib/validations/properties";
import { createId } from "@paralleldrive/cuid2";

// Properties Actions

export async function createProperty(formData: FormData) {
  const user = await getCurrentUser();
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
    const supabase = await createClient();

    const { data: property, error } = await supabase
      .from("properties")
      // @ts-ignore - Types will be properly generated after running migrations
      .insert({
        id: createId(),
        name: validation.data.name,
        address: validation.data.address,
        city: validation.data.city,
        state: validation.data.state,
        zip_code: validation.data.zipCode,
        country: validation.data.country,
        property_type: validation.data.propertyType,
        number_of_units: validation.data.numberOfUnits,
        year_built: validation.data.yearBuilt,
        square_feet: validation.data.squareFeet?.toString() ?? null,
        lot_size: validation.data.lotSize?.toString() ?? null,
        purchase_price: validation.data.purchasePrice?.toString() ?? null,
        purchase_date: validation.data.purchaseDate,
        current_value: validation.data.currentValue?.toString() ?? null,
        status: validation.data.status,
        notes: validation.data.notes,
        created_by: user.id,
        updated_by: user.id,
        organization_id: user.organizationId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create property:", error);
      return { error: "Failed to create property" };
    }

    revalidatePath("/dashboard/properties");
    return { success: true, property };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { error: "Failed to create property" };
  }
}

export async function updateProperty(id: string, formData: FormData) {
  const user = await getCurrentUser();
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
    const supabase = await createClient();

    const { data: property, error } = await supabase
      .from("properties")
      // @ts-ignore - Types will be properly generated after running migrations
      .update({
        name: validation.data.name,
        address: validation.data.address,
        city: validation.data.city,
        state: validation.data.state,
        zip_code: validation.data.zipCode,
        country: validation.data.country,
        property_type: validation.data.propertyType,
        number_of_units: validation.data.numberOfUnits,
        year_built: validation.data.yearBuilt,
        square_feet: validation.data.squareFeet?.toString() ?? null,
        lot_size: validation.data.lotSize?.toString() ?? null,
        purchase_price: validation.data.purchasePrice?.toString() ?? null,
        purchase_date: validation.data.purchaseDate,
        current_value: validation.data.currentValue?.toString() ?? null,
        status: validation.data.status,
        notes: validation.data.notes,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update property:", error);
      return { error: "Failed to update property" };
    }

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
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete property:", error);
      return { error: "Failed to delete property" };
    }

    revalidatePath("/dashboard/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { error: "Failed to delete property" };
  }
}

export async function getProperties() {
  try {
    const supabase = await createClient();

    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch properties:", error);
      return { error: "Failed to fetch properties", properties: [] };
    }

    return { properties: properties || [] };
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return { error: "Failed to fetch properties", properties: [] };
  }
}

export async function getPropertyById(id: string) {
  try {
    const supabase = await createClient();

    const { data: property, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch property:", error);
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
  const user = await getCurrentUser();
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
    const supabase = await createClient();

    const { data: unit, error } = await supabase
      .from("units")
      // @ts-ignore - Types will be properly generated after running migrations
      .insert({
        id: createId(),
        property_id: validation.data.propertyId,
        unit_number: validation.data.unitNumber,
        floor: validation.data.floor,
        bedrooms: validation.data.bedrooms,
        bathrooms: validation.data.bathrooms.toString(),
        square_feet: validation.data.squareFeet?.toString() ?? null,
        monthly_rent: validation.data.monthlyRent?.toString() ?? null,
        security_deposit: validation.data.securityDeposit?.toString() ?? null,
        status: validation.data.status,
        is_available: validation.data.isAvailable,
        features: validation.data.features,
        notes: validation.data.notes,
        created_by: user.id,
        updated_by: user.id,
        organization_id: user.organizationId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create unit:", error);
      return { error: "Failed to create unit" };
    }

    revalidatePath(`/dashboard/properties/${validation.data.propertyId}`);
    return { success: true, unit };
  } catch (error) {
    console.error("Failed to create unit:", error);
    return { error: "Failed to create unit" };
  }
}

export async function getUnitsByPropertyId(propertyId: string) {
  try {
    const supabase = await createClient();

    const { data: units, error } = await supabase
      .from("units")
      .select("*")
      .eq("property_id", propertyId)
      .order("unit_number", { ascending: true });

    if (error) {
      console.error("Failed to fetch units:", error);
      return { error: "Failed to fetch units", units: [] };
    }

    return { units: units || [] };
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return { error: "Failed to fetch units", units: [] };
  }
}

export async function getUnitById(id: string) {
  try {
    const supabase = await createClient();

    const { data: unit, error } = await supabase
      .from("units")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch unit:", error);
      return { error: "Unit not found", unit: null };
    }

    return { unit };
  } catch (error) {
    console.error("Failed to fetch unit:", error);
    return { error: "Failed to fetch unit", unit: null };
  }
}

export async function updateUnit(id: string, formData: FormData) {
  const user = await getCurrentUser();
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
    const supabase = await createClient();

    const { data: unit, error } = await supabase
      .from("units")
      // @ts-ignore - Types will be properly generated after running migrations
      .update({
        property_id: validation.data.propertyId,
        unit_number: validation.data.unitNumber,
        floor: validation.data.floor,
        bedrooms: validation.data.bedrooms,
        bathrooms: validation.data.bathrooms.toString(),
        square_feet: validation.data.squareFeet?.toString() ?? null,
        monthly_rent: validation.data.monthlyRent?.toString() ?? null,
        security_deposit: validation.data.securityDeposit?.toString() ?? null,
        status: validation.data.status,
        is_available: validation.data.isAvailable,
        features: validation.data.features,
        notes: validation.data.notes,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update unit:", error);
      return { error: "Failed to update unit" };
    }

    if (!unit) {
      return { error: "Unit not found" };
    }

    revalidatePath(`/dashboard/properties/${validation.data.propertyId}`);
    revalidatePath(`/dashboard/units/${id}`);
    return { success: true, unit };
  } catch (error) {
    console.error("Failed to update unit:", error);
    return { error: "Failed to update unit" };
  }
}

export async function deleteUnit(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const supabase = await createClient();

    // Get the property ID before deleting so we can revalidate
    const { data: unit } = await supabase
      .from("units")
      .select("property_id")
      .eq("id", id)
      .single();

    if (!unit) {
      return { error: "Unit not found" };
    }

    const { error } = await supabase
      .from("units")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete unit:", error);
      return { error: "Failed to delete unit" };
    }

    revalidatePath(`/dashboard/properties/${(unit as any).property_id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return { error: "Failed to delete unit" };
  }
}
