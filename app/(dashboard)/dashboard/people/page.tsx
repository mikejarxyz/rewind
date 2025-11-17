import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPeople } from "@/actions/people";
import { PeopleTable } from "./people-table";

export default async function PeoplePage() {
  const { people, error } = await getPeople();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">People & Clients</h1>
          <p className="text-muted-foreground">
            Manage tenants, landlords, vendors, and contacts
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">People & Clients</h1>
          <p className="text-muted-foreground">
            Manage tenants, landlords, vendors, and contacts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/people/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Person
          </Link>
        </Button>
      </div>

      {people.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No people yet</CardTitle>
            <CardDescription>
              Get started by adding your first person or client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/people/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Person
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <PeopleTable people={people} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
