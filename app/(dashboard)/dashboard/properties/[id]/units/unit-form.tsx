"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUnit, updateUnit } from "@/actions/properties";
import type { Unit } from "@/types/database";

interface UnitFormProps {
  propertyId: string;
  unit?: Unit;
}

export function UnitForm({ propertyId, unit }: UnitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(unit?.isAvailable ?? true);
  const isEditing = !!unit;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Add the propertyId to the form data
    formData.set("propertyId", propertyId);
    formData.set("isAvailable", isAvailable.toString());

    const result = isEditing
      ? await updateUnit(unit.id, formData)
      : await createUnit(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/dashboard/properties/${propertyId}`);
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the unit's basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">
                Unit Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="unitNumber"
                name="unitNumber"
                defaultValue={unit?.unitNumber}
                required
                placeholder="e.g., 101, A, 1st Floor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                name="floor"
                defaultValue={unit?.floor || ""}
                placeholder="e.g., 1, 2, Ground"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                defaultValue={unit?.bedrooms ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                step="0.5"
                min="0"
                defaultValue={unit?.bathrooms ?? "1.0"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareFeet">Square Feet</Label>
            <Input
              id="squareFeet"
              name="squareFeet"
              type="number"
              min="0"
              defaultValue={unit?.squareFeet || ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rental Information */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Information</CardTitle>
          <CardDescription>Rent and deposit details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                step="0.01"
                min="0"
                defaultValue={unit?.monthlyRent || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
              <Input
                id="securityDeposit"
                name="securityDeposit"
                type="number"
                step="0.01"
                min="0"
                defaultValue={unit?.securityDeposit || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={unit?.status || "vacant"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label
              htmlFor="isAvailable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Available for rent
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Features & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Features & Notes</CardTitle>
          <CardDescription>
            Additional details about this unit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="features">Features</Label>
            <Textarea
              id="features"
              name="features"
              rows={3}
              defaultValue={unit?.features || ""}
              placeholder="e.g., Hardwood floors, updated kitchen, balcony..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={unit?.notes || ""}
              placeholder="Internal notes about this unit..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Unit" : "Create Unit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
