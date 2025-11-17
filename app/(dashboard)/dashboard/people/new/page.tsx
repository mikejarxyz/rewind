import { PersonForm } from "../person-form";

export default function NewPersonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Person</h1>
        <p className="text-muted-foreground">
          Create a new person or client record
        </p>
      </div>
      <PersonForm />
    </div>
  );
}
