import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProperties } from "@/actions/properties";
import { PropertiesTable } from "./properties-table";

export default async function PropertiesPage() {
  const { properties, error } = await getProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : properties.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No properties yet</CardTitle>
            <CardDescription>
              Get started by adding your first property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Properties</CardTitle>
            <CardDescription>
              {properties.length} {properties.length === 1 ? "property" : "properties"} in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertiesTable properties={properties} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
