"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { personSchema } from "@/lib/validations/people";
import { createId } from "@paralleldrive/cuid2";

export async function createPerson(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      alternatePhone: formData.get("alternatePhone") as string,
      type: formData.get("type") as string,
      companyName: formData.get("companyName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      emergencyContactName: formData.get("emergencyContactName") as string,
      emergencyContactPhone: formData.get("emergencyContactPhone") as string,
      emergencyContactRelationship: formData.get("emergencyContactRelationship") as string,
      notes: formData.get("notes") as string,
      status: formData.get("status") as string,
      vendorCategory: formData.get("vendorCategory") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    };

    const validation = personSchema.safeParse(data);

    if (!validation.success) {
      return {
        error: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    const { data: person, error } = await supabase
      .from("people")
      // @ts-ignore - Types will be properly generated after running migrations
      .insert({
        id: createId(),
        first_name: validation.data.firstName,
        last_name: validation.data.lastName,
        email: validation.data.email || null,
        phone: validation.data.phone || null,
        alternate_phone: validation.data.alternatePhone || null,
        type: validation.data.type as "tenant" | "landlord" | "vendor" | "contact",
        company_name: validation.data.companyName || null,
        address: validation.data.address || null,
        city: validation.data.city || null,
        state: validation.data.state || null,
        zip_code: validation.data.zipCode || null,
        emergency_contact_name: validation.data.emergencyContactName || null,
        emergency_contact_phone: validation.data.emergencyContactPhone || null,
        emergency_contact_relationship: validation.data.emergencyContactRelationship || null,
        notes: validation.data.notes || null,
        status: validation.data.status as "active" | "inactive",
        vendor_category: validation.data.vendorCategory || null,
        license_number: validation.data.licenseNumber || null,
        created_by: user.id,
        updated_by: user.id,
        organization_id: user.organizationId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create person:", error);
      return { error: "Failed to create person" };
    }

    revalidatePath("/dashboard/people");
    return { success: true, person };
  } catch (error) {
    console.error("Failed to create person:", error);
    return { error: "Failed to create person" };
  }
}

export async function getPeople() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized", people: [] };
    }

    const supabase = await createClient();

    const { data: people, error } = await supabase
      .from("people")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch people:", error);
      return { error: "Failed to fetch people", people: [] };
    }

    return { people: people || [] };
  } catch (error) {
    console.error("Failed to fetch people:", error);
    return { error: "Failed to fetch people", people: [] };
  }
}

export async function getPersonById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized", person: null };
    }

    const supabase = await createClient();

    const { data: person, error } = await supabase
      .from("people")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch person:", error);
      return { error: "Person not found", person: null };
    }

    return { person };
  } catch (error) {
    console.error("Failed to fetch person:", error);
    return { error: "Failed to fetch person", person: null };
  }
}

export async function updatePerson(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      alternatePhone: formData.get("alternatePhone") as string,
      type: formData.get("type") as string,
      companyName: formData.get("companyName") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      emergencyContactName: formData.get("emergencyContactName") as string,
      emergencyContactPhone: formData.get("emergencyContactPhone") as string,
      emergencyContactRelationship: formData.get("emergencyContactRelationship") as string,
      notes: formData.get("notes") as string,
      status: formData.get("status") as string,
      vendorCategory: formData.get("vendorCategory") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    };

    const validation = personSchema.safeParse(data);

    if (!validation.success) {
      return {
        error: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    const { data: person, error } = await supabase
      .from("people")
      // @ts-ignore - Types will be properly generated after running migrations
      .update({
        first_name: validation.data.firstName,
        last_name: validation.data.lastName,
        email: validation.data.email || null,
        phone: validation.data.phone || null,
        alternate_phone: validation.data.alternatePhone || null,
        type: validation.data.type as "tenant" | "landlord" | "vendor" | "contact",
        company_name: validation.data.companyName || null,
        address: validation.data.address || null,
        city: validation.data.city || null,
        state: validation.data.state || null,
        zip_code: validation.data.zipCode || null,
        emergency_contact_name: validation.data.emergencyContactName || null,
        emergency_contact_phone: validation.data.emergencyContactPhone || null,
        emergency_contact_relationship: validation.data.emergencyContactRelationship || null,
        notes: validation.data.notes || null,
        status: validation.data.status as "active" | "inactive",
        vendor_category: validation.data.vendorCategory || null,
        license_number: validation.data.licenseNumber || null,
        updated_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update person:", error);
      return { error: "Failed to update person" };
    }

    if (!person) {
      return { error: "Person not found" };
    }

    revalidatePath("/dashboard/people");
    revalidatePath(`/dashboard/people/${id}`);
    return { success: true, person };
  } catch (error) {
    console.error("Failed to update person:", error);
    return { error: "Failed to update person" };
  }
}

export async function deletePerson(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("people")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete person:", error);
      return { error: "Failed to delete person" };
    }

    revalidatePath("/dashboard/people");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete person:", error);
    return { error: "Failed to delete person" };
  }
}
