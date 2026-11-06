"use client";

import React from "react";
import { StepCard } from "./StepCard";

const steps = [
  {
    step: "1",
    title: "Inscris-toi gratuitement",
    description:
      "Renseigne le nom de ton entreprise, ton pays et ajoute ton logo. Ton compte est prêt en moins de 60 secondes chrono.",
    meta: "⏱ Temps requis : 45 secondes",
    metaVariant: "slate" as const,
  },
  {
    step: "2",
    title: "Crée ta première facture",
    description:
      "Rentre les coordonnées de ton client et tes articles. Les montants s'ajustent en FCFA avec le calcul automatique de la TVA 18%.",
    meta: "✨ Design certifié pro",
    metaVariant: "slate" as const,
  },
  {
    step: "3",
    title: "Envoie et suis les paiements",
    description:
      "Transmets la facture en PDF par email ou WhatsApp. Reçois une notification dès que ton client consulte ou règle le montant.",
    meta: "💰 Encaissement accéléré",
    metaVariant: "emerald" as const,
  },
];

export function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Démarrage en 3 minutes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mt-3">
            Comment ça marche ?
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Pas de configuration complexe, pas de manuel de 100 pages. Vous commencez à facturer dès aujourd'hui.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

