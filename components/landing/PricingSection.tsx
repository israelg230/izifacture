"use client";

import React from "react";
import { PricingCard } from "./PricingCard";

const plans = [
  {
    name: "Plan Gratuit",
    badge: "Pour tester",
    description: "Idéal pour les freelances qui démarrent tout juste leur activité.",
    price: "0",
    features: [
      { text: "par mois", strong: "5 factures" },
      { text: "inclus", strong: "1 utilisateur" },
      "Calcul TVA 18% automatique",
      "Téléchargement PDF standard",
    ],
    isFeatured: false,
    ctaText: "Créer mon compte gratuit",
    ctaHref: "/connexion?mode=register",
  },
  {
    name: "Plan Pro",
    badge: "Sans limite",
    description: "Pour les entrepreneurs actifs qui veulent une facturation sans friction.",
    price: "5 000",
    features: [
      { text: "", strong: "Factures illimitées" },
      "Personnalisation complète avec logo & couleurs",
      "Suivi des paiements & relances WhatsApp",
      "Support prioritaire 7j/7",
      "Export comptable Excel en 1 clic",
    ],
    isFeatured: true,
    ctaText: "Essayer le Plan Pro gratuitement",
    ctaHref: "/connexion?mode=register",
  },
  {
    name: "Plan Business",
    badge: "Équipes",
    description: "Pour les agences, PME et structures en pleine expansion.",
    price: "15 000",
    features: [
      { text: "(jusqu'à 10 accès)", strong: "Multi-utilisateurs" },
      "Tout ce qui est inclus dans le Plan Pro",
      "Rôles & permissions personnalisés",
      "Gestion multi-entités / plusieurs marques",
      "Gestionnaire de compte dédié",
    ],
    isFeatured: false,
    ctaText: "Contacter l'équipe commerciale",
    ctaHref: "/connexion?mode=register",
  },
];

export function PricingSection() {
  return (
    <section id="tarification" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Tarifs clairs & transparents
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mt-3">
            Un investissement rentabilisé dès la première facture.
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            Choisissez l'offre qui correspond à la taille de votre activité. Modifiable ou résiliable à tout moment.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

