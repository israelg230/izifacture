import { redirect } from "next/navigation";

export default function RapportsRoute() {
  redirect("/clients?tab=rapports");
}
