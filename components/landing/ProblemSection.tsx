"use client";

import React from "react";
import { ProblemCard } from "./ProblemCard";

const problems = [
  {
    number: "01",
    title: "Factures non professionnelles",
    description:
      "Des tableaux Word mal alignés, des logos flous et des polices dépareillées. Les grands comptes et multinationales prennent du temps à régler les fournisseurs qui manquent de rigueur visuelle.",
    impact: "Crédibilité affaiblie et négociation difficile",
    badgeVariant: "rose" as const,
  },
  {
    number: "02",
    title: "Calculs manuels de TVA & BRS",
    description:
      "Calculer à la main la TVA à 18%, arrondir les centimes ou oublier les retenues à la source mène à des rejets de factures par la comptabilité client et des redressements fiscaux inutiles.",
    impact: "Retards de paiement de 30 à 60 jours",
    badgeVariant: "amber" as const,
  },
  {
    number: "03",
    title: "Suivi des paiements impossible",
    description:
      "Quel client a payé ? Qui est en retard ? Quand faut-il relancer ? Se perdre entre des carnets de reçus, des messages WhatsApp éparpillés et des virements bancaires non pointés.",
    impact: "Trésorerie fragile et impayés oubliés",
    badgeVariant: "slate" as const,
  },
];

export function ProblemSection() {
  return (
    <section id="probleme" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold uppercase tracking-wider mb-4">
            Le constat sur le terrain
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            La facturation traditionnelle vous fait perdre du temps et de l'argent.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Chaque mois, des millions de francs CFA dorment dehors ou sont contestés simplement à cause d'outils inadaptés à notre réalité économique.
          </p>
        </div>

        {/* 3 Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((problem) => (
            <ProblemCard key={problem.number} {...problem} />
          ))}
        </div>
      </div>
    </section>
  );
}

