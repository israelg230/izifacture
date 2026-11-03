import { redirect } from "next/navigation";

export default function PaiementsRoute() {
  redirect("/clients?tab=paiements");
}
