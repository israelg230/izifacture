"use client";

import React from "react";
import { Zap, Calculator, BarChart3, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    step: "01",
    category: "Rapidité",
    title: "Factures professionnelles en 2 clics",
    description:
      "Sélectionnez votre client, ajoutez vos prestations, et téléchargez un PDF élégant portant votre logo, vos mentions légales et votre signature.",
    footerText: "Export PDF & envoi WhatsApp direct →",
    icon: Zap,
    theme: "blue" as const,
  },
  {
    step: "02",
    category: "Conformité",
    title: "TVA 18% calculée automatiquement",
    description:
      "Ne perdez plus de temps avec la calculatrice. iziFacture applique la TVA réglementaire de 18% et prend en compte les exonérations selon votre statut.",
    footerText: "Zéro erreur de centimes FCFA →",
    icon: Calculator,
    theme: "emerald" as const,
  },
  {
    step: "03",
    category: "Trésorerie",
    title: "Suivi des paiements en temps réel",
    description:
      "Visualisez d'un coup d'œil les factures en attente, payées et en retard. Déclenchez des rappels cordiaux en un clic pour sécuriser votre trésorerie.",
    footerText: "Alerte échéance instantanée →",
    icon: BarChart3,
    theme: "amber" as const,
  },
  {
    step: "04",
    category: "Réseau",
    title: "Gestion de clients intégrée",
    description:
      "Conservez votre carnet d'adresses professionnel avec numéros RCCM / NCC / IFU, contacts WhatsApp et historique complet de toutes les transactions passées.",
    footerText: "Historique complet par client →",
    icon: Users,
    theme: "indigo" as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 md:py-32 bg-[#F8FAFC] border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-600 block mb-3">
              Simplicité & Puissance
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Conçu pour accélérer votre quotidien.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md mt-4 md:mt-0 text-sm leading-relaxed">
            Chaque détail a été affiné pour supprimer la bureaucratie et vous permettre d'encaisser plus rapidement.
          </p>
        </div>

        {/* Features 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

