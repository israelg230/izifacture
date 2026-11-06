"use client";

import React from "react";
import { HeroPrimaryButton } from "./HeroPrimaryButton";

export function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-[#0B0F19] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-slate-900/60 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-blue-400 mb-6 border border-white/10">
          Passez au niveau supérieur
        </span>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Rejoins les entrepreneurs qui facturent comme des pros.
        </h2>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Créez votre première facture en moins de 2 minutes. Sans carte de crédit, sans engagement.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <HeroPrimaryButton
            href="/connexion?mode=register"
            variant="light"
            size="lg"
            className="w-full sm:w-auto"
          >
            Commencer gratuitement
          </HeroPrimaryButton>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
          <span>✓ 5 factures gratuites / mois</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ 100% en ligne sans installation</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ Support WhatsApp dédié</span>
        </div>
      </div>
    </section>
  );
}

