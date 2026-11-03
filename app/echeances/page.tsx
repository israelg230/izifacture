import { redirect } from "next/navigation";

export default function EcheancesRoute() {
  redirect("/clients?tab=echeances");
}
