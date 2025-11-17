"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { personSchema } from "@/lib/validations/people";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/actions/auth";

export async function createPerson(formData: FormData) {
  try {
    const user = await getUser();
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

    const [person] = await db
      .insert(people)
      .values({
        ...validation.data,
        email: validation.data.email || null,
        phone: validation.data.phone || null,
        alternatePhone: validation.data.alternatePhone || null,
        companyName: validation.data.companyName || null,
        address: validation.data.address || null,
        city: validation.data.city || null,
        state: validation.data.state || null,
        zipCode: validation.data.zipCode || null,
        emergencyContactName: validation.data.emergencyContactName || null,
        emergencyContactPhone: validation.data.emergencyContactPhone || null,
        emergencyContactRelationship: validation.data.emergencyContactRelationship || null,
        notes: validation.data.notes || null,
        vendorCategory: validation.data.vendorCategory || null,
        licenseNumber: validation.data.licenseNumber || null,
        createdBy: user.id,
        updatedBy: user.id,
      })
      .returning();

    revalidatePath("/dashboard/people");
    return { success: true, person };
  } catch (error) {
    console.error("Failed to create person:", error);
    return { error: "Failed to create person" };
  }
}

export async function getPeople() {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Unauthorized", people: [] };
    }

    const allPeople = await db
      .select()
      .from(people)
      .orderBy(desc(people.createdAt));

    return { people: allPeople };
  } catch (error) {
    console.error("Failed to fetch people:", error);
    return { error: "Failed to fetch people", people: [] };
  }
}

export async function getPersonById(id: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Unauthorized", person: null };
    }

    const [person] = await db
      .select()
      .from(people)
      .where(eq(people.id, id))
      .limit(1);

    if (!person) {
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
    const user = await getUser();
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

    const [updatedPerson] = await db
      .update(people)
      .set({
        ...validation.data,
        email: validation.data.email || null,
        phone: validation.data.phone || null,
        alternatePhone: validation.data.alternatePhone || null,
        companyName: validation.data.companyName || null,
        address: validation.data.address || null,
        city: validation.data.city || null,
        state: validation.data.state || null,
        zipCode: validation.data.zipCode || null,
        emergencyContactName: validation.data.emergencyContactName || null,
        emergencyContactPhone: validation.data.emergencyContactPhone || null,
        emergencyContactRelationship: validation.data.emergencyContactRelationship || null,
        notes: validation.data.notes || null,
        vendorCategory: validation.data.vendorCategory || null,
        licenseNumber: validation.data.licenseNumber || null,
        updatedBy: user.id,
        updatedAt: new Date(),
      })
      .where(eq(people.id, id))
      .returning();

    if (!updatedPerson) {
      return { error: "Person not found" };
    }

    revalidatePath("/dashboard/people");
    revalidatePath(`/dashboard/people/${id}`);
    return { success: true, person: updatedPerson };
  } catch (error) {
    console.error("Failed to update person:", error);
    return { error: "Failed to update person" };
  }
}

export async function deletePerson(id: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    await db.delete(people).where(eq(people.id, id));

    revalidatePath("/dashboard/people");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete person:", error);
    return { error: "Failed to delete person" };
  }
}
