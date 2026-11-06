"use client";

import React from "react";
import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    quote:
      "Avant iziFacture, je passais mes dimanches soirs à me battre avec des modèles Word qui se déformaient à chaque ligne. Aujourd'hui, j'envoie mes factures directement sur WhatsApp à mes clients dakarois en 2 minutes. Mes délais de paiement ont été divisés par deux.",
    name: "Mamadou Sy",
    role: "Fondateur",
    company: "Teranga Studio",
    location: "Dakar, Sénégal",
    initials: "MS",
    avatarBg: "bg-slate-900",
  },
  {
    quote:
      "Le calcul automatique de la TVA à 18% m'a évité tellement de maux de tête avec la comptabilité de nos clients du Plateau. On a l'air ultra pro face aux grands groupes, et le montant en FCFA est toujours clair et sans contestation.",
    name: "Aïssatou Kouassi",
    role: "Directrice Associée",
    company: "Ivoire Digital",
    location: "Abidjan, Côte d'Ivoire",
    initials: "AK",
    avatarBg: "bg-blue-600",
  },
  {
    quote:
      "Le suivi en temps réel des impayés a changé la gestion de ma trésorerie à Douala. Je sais exactement qui me doit quoi, et les relances douces me permettent de me faire payer sans froisser mes partenaires.",
    name: "Junior Nkamgang",
    role: "Consultant Logistique & Supply",
    company: "J-Logistics",
    location: "Douala, Cameroun",
    initials: "JN",
    avatarBg: "bg-emerald-600",
  },
];

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-20 md:py-32 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-3">
              Retours d'expérience
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Ils facturent déjà avec sérénité.
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-amber-500 font-bold text-sm bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
            <span>★★★★★</span>
            <span className="text-slate-700">4.9/5 basé sur 350+ avis</span>
          </div>
        </div>

        {/* Testimonials 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

