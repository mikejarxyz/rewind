/**
 * Database entity types
 * Re-exports from Supabase generated types for easier use in components
 */

import type { Database } from "./supabase";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Unit = Database["public"]["Tables"]["units"]["Row"];
export type Person = Database["public"]["Tables"]["people"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type NewProperty = Database["public"]["Tables"]["properties"]["Insert"];
export type NewUnit = Database["public"]["Tables"]["units"]["Insert"];
export type NewPerson = Database["public"]["Tables"]["people"]["Insert"];
export type NewProfile = Database["public"]["Tables"]["profiles"]["Insert"];

export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];
export type UnitUpdate = Database["public"]["Tables"]["units"]["Update"];
export type PersonUpdate = Database["public"]["Tables"]["people"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
