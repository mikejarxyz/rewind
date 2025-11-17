import { redirect } from "next/navigation";
import { getUser } from "@/actions/auth";

export default async function Home() {
  const user = await getUser();

  // Redirect to dashboard if logged in, otherwise to login
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
