import { notFound } from "next/navigation";
import { getPropertyById } from "@/actions/properties";
import { UnitForm } from "../unit-form";

interface NewUnitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewUnitPage({ params }: NewUnitPageProps) {
  const { id } = await params;
  const { property, error } = await getPropertyById(id);

  if (error || !property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Unit</h1>
        <p className="text-muted-foreground">
          Create a new unit for {property.name}
        </p>
      </div>
      <UnitForm propertyId={id} />
    </div>
  );
}
