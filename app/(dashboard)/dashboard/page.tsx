import { getUser } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No properties yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No active leases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tenants yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">No revenue yet</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Set up your property management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Add your first property</p>
                <p className="text-sm text-muted-foreground">
                  Start by adding properties to your portfolio
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Add tenants and contacts</p>
                <p className="text-sm text-muted-foreground">
                  Manage your tenants, landlords, and other contacts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Set up accounting</p>
                <p className="text-sm text-muted-foreground">
                  Track income, expenses, and generate reports
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
