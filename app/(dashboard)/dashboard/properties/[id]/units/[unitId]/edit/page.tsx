import { notFound } from "next/navigation";
import { getUnitById, getPropertyById } from "@/actions/properties";
import { UnitForm } from "../../unit-form";

interface EditUnitPageProps {
  params: Promise<{
    id: string;
    unitId: string;
  }>;
}

export default async function EditUnitPage({ params }: EditUnitPageProps) {
  const { id, unitId } = await params;
  const [{ unit, error: unitError }, { property, error: propertyError }] = await Promise.all([
    getUnitById(unitId),
    getPropertyById(id),
  ]);

  if (unitError || !unit || propertyError || !property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Unit</h1>
        <p className="text-muted-foreground">
          Update unit {unit.unitNumber} in {property.name}
        </p>
      </div>
      <UnitForm propertyId={id} unit={unit} />
    </div>
  );
}
