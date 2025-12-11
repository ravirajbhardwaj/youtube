import { redirect } from "next/navigation";

export default async function Home() {
  if (false) {
    redirect("/home");
  }

  return redirect("/signin");
}
