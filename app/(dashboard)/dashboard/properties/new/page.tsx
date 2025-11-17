import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyForm } from "../property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new property
          </p>
        </div>
      </div>

      <PropertyForm />
    </div>
  );
}
