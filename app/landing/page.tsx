import { Metadata } from "next";
import { LandingPageLayout } from "@/components/landing/LandingPageLayout";

export const metadata: Metadata = {
  title: "iziFacture — Facturation moderne pour entrepreneurs africains",
  description:
    "Fini les factures bricolées sur Word et Excel. iziFacture est le logiciel ultra-rapide pensé pour les entrepreneurs africains : factures en FCFA, calcul automatique TVA 18% et paiements Mobile Money.",
};

export default function LandingPage() {
  return <LandingPageLayout />;
}

