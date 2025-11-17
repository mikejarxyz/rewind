import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPropertyById, getUnitsByPropertyId } from "@/actions/properties";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const { property, error } = await getPropertyById(id);
  const { units } = await getUnitsByPropertyId(id);

  if (error || !property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/properties">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p className="text-muted-foreground">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zipCode}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/properties/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Type
                </p>
                <p className="capitalize">{property.propertyType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    property.status === "active"
                      ? "default"
                      : property.status === "sold"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {property.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Number of Units
                </p>
                <p>{property.numberOfUnits}</p>
              </div>
              {property.yearBuilt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Year Built
                  </p>
                  <p>{property.yearBuilt}</p>
                </div>
              )}
              {property.squareFeet && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Square Feet
                  </p>
                  <p>{Number(property.squareFeet).toLocaleString()}</p>
                </div>
              )}
              {property.lotSize && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Lot Size
                  </p>
                  <p>{Number(property.lotSize).toLocaleString()} sq ft</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {property.purchasePrice && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Purchase Price
                  </p>
                  <p>
                    ${Number(property.purchasePrice).toLocaleString()}
                  </p>
                </div>
              )}
              {property.purchaseDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Purchase Date
                  </p>
                  <p>
                    {new Date(property.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {property.currentValue && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Value
                  </p>
                  <p>
                    ${Number(property.currentValue).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {property.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{property.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Units</CardTitle>
              <CardDescription>
                {units.length} {units.length === 1 ? "unit" : "units"} in this
                property
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href={`/dashboard/properties/${id}/units/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No units added yet.{" "}
              <Link
                href={`/dashboard/properties/${id}/units/new`}
                className="underline"
              >
                Add your first unit
              </Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Number</TableHead>
                  <TableHead>Bedrooms</TableHead>
                  <TableHead>Bathrooms</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.unitNumber}
                    </TableCell>
                    <TableCell>{unit.bedrooms}</TableCell>
                    <TableCell>{unit.bathrooms}</TableCell>
                    <TableCell>
                      {unit.monthlyRent
                        ? `$${Number(unit.monthlyRent).toLocaleString()}/mo`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          unit.status === "occupied"
                            ? "default"
                            : unit.status === "maintenance"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {unit.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
