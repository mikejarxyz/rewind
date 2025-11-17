import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Mail, Phone, MapPin, Building2, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPersonById } from "@/actions/people";
import type { Person } from "@/types/database";

interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonDetailPage({
  params,
}: PersonDetailPageProps) {
  const { id } = await params;
  const { person, error } = await getPersonById(id);

  if (error || !person) {
    notFound();
  }

  const typedPerson = person as Person;

  function getTypeColor(type: string) {
    switch (type) {
      case "tenant":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "landlord":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "vendor":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "contact":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {typedPerson.first_name} {typedPerson.last_name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className={getTypeColor(typedPerson.type)}>
              {typedPerson.type}
            </Badge>
            <Badge variant="secondary" className={getStatusColor(typedPerson.status)}>
              {typedPerson.status}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/people/${typedPerson.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Primary contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {typedPerson.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{typedPerson.email}</p>
              </div>
            </div>
          )}

          {typedPerson.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{typedPerson.phone}</p>
              </div>
            </div>
          )}

          {typedPerson.alternate_phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Alternate Phone</p>
                <p className="text-sm text-muted-foreground">
                  {typedPerson.alternate_phone}
                </p>
              </div>
            </div>
          )}

          {!typedPerson.email && !typedPerson.phone && !typedPerson.alternate_phone && (
            <p className="text-sm text-muted-foreground">
              No contact information available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Address */}
      {(typedPerson.address || typedPerson.city || typedPerson.state || typedPerson.zip_code) && (
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Physical location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                {typedPerson.address && (
                  <p className="text-sm">{typedPerson.address}</p>
                )}
                {(typedPerson.city || typedPerson.state || typedPerson.zip_code) && (
                  <p className="text-sm text-muted-foreground">
                    {[typedPerson.city, typedPerson.state, typedPerson.zip_code]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      {(typedPerson.company_name ||
        typedPerson.vendor_category ||
        typedPerson.license_number) && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typedPerson.company_name && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company Name</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.company_name}
                  </p>
                </div>
              </div>
            )}

            {typedPerson.vendor_category && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.vendor_category}
                  </p>
                </div>
              </div>
            )}

            {typedPerson.license_number && (
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">License Number</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.license_number}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      {typedPerson.type === "tenant" &&
        (typedPerson.emergency_contact_name ||
          typedPerson.emergency_contact_phone ||
          typedPerson.emergency_contact_relationship) && (
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Emergency contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {typedPerson.emergency_contact_name && (
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.emergency_contact_name}
                  </p>
                </div>
              )}

              {typedPerson.emergency_contact_phone && (
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.emergency_contact_phone}
                  </p>
                </div>
              )}

              {typedPerson.emergency_contact_relationship && (
                <div>
                  <p className="text-sm font-medium">Relationship</p>
                  <p className="text-sm text-muted-foreground">
                    {typedPerson.emergency_contact_relationship}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Notes */}
      {typedPerson.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{typedPerson.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
