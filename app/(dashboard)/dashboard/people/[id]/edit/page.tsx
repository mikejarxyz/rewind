import { notFound } from "next/navigation";
import { getPersonById } from "@/actions/people";
import { PersonForm } from "../../person-form";

interface EditPersonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPersonPage({ params }: EditPersonPageProps) {
  const { id } = await params;
  const { person, error } = await getPersonById(id);

  if (error || !person) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Person</h1>
        <p className="text-muted-foreground">
          Update {person.firstName} {person.lastName}'s information
        </p>
      </div>
      <PersonForm person={person} />
    </div>
  );
}
