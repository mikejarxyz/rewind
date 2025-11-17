/**
 * Database types generated from Supabase schema
 *
 * To regenerate these types after migrations:
 * npx supabase gen types typescript --local > types/supabase.ts
 * or
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      people: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          alternate_phone: string | null
          type: "tenant" | "landlord" | "vendor" | "contact"
          company_name: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          notes: string | null
          status: "active" | "inactive"
          vendor_category: string | null
          license_number: string | null
          created_at: string
          updated_at: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          alternate_phone?: string | null
          type: "tenant" | "landlord" | "vendor" | "contact"
          company_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          notes?: string | null
          status?: "active" | "inactive"
          vendor_category?: string | null
          license_number?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          alternate_phone?: string | null
          type?: "tenant" | "landlord" | "vendor" | "contact"
          company_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          notes?: string | null
          status?: "active" | "inactive"
          vendor_category?: string | null
          license_number?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string
          organization_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          role: "owner" | "property_manager" | "bookkeeper" | "maintenance" | "viewer"
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          role?: "owner" | "property_manager" | "bookkeeper" | "maintenance" | "viewer"
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          role?: "owner" | "property_manager" | "bookkeeper" | "maintenance" | "viewer"
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          country: string
          property_type: "residential" | "commercial" | "mixed-use"
          number_of_units: number
          year_built: number | null
          square_feet: string | null
          lot_size: string | null
          purchase_price: string | null
          purchase_date: string | null
          current_value: string | null
          status: "active" | "inactive" | "sold"
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Insert: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          country?: string
          property_type: "residential" | "commercial" | "mixed-use"
          number_of_units?: number
          year_built?: number | null
          square_feet?: string | null
          lot_size?: string | null
          purchase_price?: string | null
          purchase_date?: string | null
          current_value?: string | null
          status?: "active" | "inactive" | "sold"
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          property_type?: "residential" | "commercial" | "mixed-use"
          number_of_units?: number
          year_built?: number | null
          square_feet?: string | null
          lot_size?: string | null
          purchase_price?: string | null
          purchase_date?: string | null
          current_value?: string | null
          status?: "active" | "inactive" | "sold"
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string
          organization_id?: string
        }
      }
      units: {
        Row: {
          id: string
          property_id: string
          unit_number: string
          floor: string | null
          bedrooms: number
          bathrooms: string
          square_feet: string | null
          monthly_rent: string | null
          security_deposit: string | null
          status: "vacant" | "occupied" | "maintenance" | "reserved"
          is_available: boolean
          features: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Insert: {
          id: string
          property_id: string
          unit_number: string
          floor?: string | null
          bedrooms?: number
          bathrooms?: string
          square_feet?: string | null
          monthly_rent?: string | null
          security_deposit?: string | null
          status?: "vacant" | "occupied" | "maintenance" | "reserved"
          is_available?: boolean
          features?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
          updated_by: string
          organization_id: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_number?: string
          floor?: string | null
          bedrooms?: number
          bathrooms?: string
          square_feet?: string | null
          monthly_rent?: string | null
          security_deposit?: string | null
          status?: "vacant" | "occupied" | "maintenance" | "reserved"
          is_available?: boolean
          features?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
          updated_by?: string
          organization_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
