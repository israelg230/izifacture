import { redirect } from "next/navigation";

export default function RelancesRoute() {
  redirect("/clients?tab=relances");
}
