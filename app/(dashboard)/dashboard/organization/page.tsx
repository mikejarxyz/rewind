import { getOrganizationUsers } from "@/actions/organization";
import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrganizationTable } from "./organization-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function OrganizationPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { users, error } = await getOrganizationUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground">
          Manage your team members and their roles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {users && users.length} {users && users.length === 1 ? "member" : "members"} in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : users && users.length > 0 ? (
            <OrganizationTable users={users} currentUser={currentUser} />
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No team members found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
