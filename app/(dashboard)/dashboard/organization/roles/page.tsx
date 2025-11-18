import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RolesTable } from "./roles-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function RolesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Only owners can access this page
  if (currentUser.role !== "owner") {
    redirect("/dashboard/organization");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Role Permissions</h1>
        <p className="text-muted-foreground">
          View and manage permissions for each role in your organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Matrix</CardTitle>
          <CardDescription>
            Each role has different permissions. These permissions control what users can see and do.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RolesTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Owner</h3>
            <p className="text-sm text-muted-foreground">
              Full access to all features including user management, role configuration, and all data operations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Property Manager</h3>
            <p className="text-sm text-muted-foreground">
              Can create and edit properties, manage people, view accounting, and access employee information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Bookkeeper</h3>
            <p className="text-sm text-muted-foreground">
              Can view properties and people, and has full access to create and edit accounting records.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Maintenance</h3>
            <p className="text-sm text-muted-foreground">
              Read-only access to properties and people information. Cannot modify any data.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Viewer</h3>
            <p className="text-sm text-muted-foreground">
              Read-only access to properties, people, and accounting information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
