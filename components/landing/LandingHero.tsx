"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Play,
  ArrowUpRight,
  Download,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { HeroPrimaryButton } from "./HeroPrimaryButton";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden landing-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Tag Pill */}
        <div className="reveal-on-scroll flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Conforme OHADA & UEMOA • 100% calibré en FCFA</span>
          </span>
        </div>

        {/* Main Headline & Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7">
            <h1 className="reveal-on-scroll font-display text-4xl sm:text-5xl lg:text-[4.15rem] font-bold tracking-tight text-slate-950 leading-[1.08] mb-6">
              La facturation d'excellence,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                conçue pour l'Afrique moderne.
              </span>
            </h1>
            <p className="reveal-on-scroll text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal mb-8">
              Élevez le standard de votre entreprise avec des factures certifiées conformes en FCFA, un calcul rigoureux de la TVA 18% et des encaissements Mobile Money deux fois plus rapides.
            </p>

            {/* Hero CTAs */}
            <div className="reveal-on-scroll flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <HeroPrimaryButton
                href="/connexion?mode=register"
                size="lg"
                variant="dark"
                className="w-full sm:w-auto"
              >
                Commencer gratuitement
              </HeroPrimaryButton>

              <Link
                href="#comment-ca-marche"
                className="magnetic-btn px-7 py-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-base font-semibold hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
              >
                <Play className="w-4 h-4 text-slate-500 fill-slate-500" />
                <span>Voir la démo interactive</span>
              </Link>
            </div>

            {/* Micro Proof Points */}
            <div className="reveal-on-scroll mt-8 flex flex-wrap items-center gap-5 sm:gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aucune carte bancaire requise</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Export PDF pro & WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Orange Money & Wave ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-end Live Spec Sheet */}
          <div className="lg:col-span-5 reveal-on-scroll">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-subtle-glow relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Aperçu direct en temps réel
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>En direct</span>
                </span>
              </div>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Chiffre d'affaires encaissé</p>
                    <p className="text-2xl font-bold font-display text-slate-900 mt-0.5">
                      4 850 000 <span className="text-sm font-semibold text-slate-500">FCFA</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm">
                    ↑ 24%
                  </div>
                </div>

                {/* Sub Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl border border-slate-100 bg-white">
                    <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                      TVA 18% collectée
                    </span>
                    <span className="text-base font-bold text-slate-800">873 000 FCFA</span>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-slate-100 bg-white">
                    <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                      Délai moyen paiement
                    </span>
                    <span className="text-base font-bold text-emerald-600">3,2 jours</span>
                  </div>
                </div>

                {/* Recent Payment Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Facture #2024-089 payée</p>
                      <p className="text-[11px] text-slate-400">Client : SOGECA Abidjan</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    + 1 250 000 FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero App Mockup / Dashboard Preview (Cinematic Dark Framing) */}
        <div className="reveal-on-scroll relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
          {/* Window Chrome / Status Bar */}
          <div className="bg-slate-900/90 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-4 text-xs font-mono text-slate-400">
                app.izifacture.com/tableau-de-bord
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="hidden sm:inline-block">Entreprise : Dakar Tech Solutions SARL</span>
              <span className="px-2.5 py-1 rounded-md bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30">
                Devise : XOF (FCFA)
              </span>
            </div>
          </div>

          {/* Dashboard Internal Grid */}
          <div className="p-5 sm:p-8 md:p-10 bg-[#0B0F19] text-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel: Live Invoice Creator */}
              <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                      Nouvelle Facture
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-0.5">
                      Facture #FAC-2024-0042
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Statut : Envoyée
                    </span>
                    <Link
                      href="/connexion"
                      className="px-3 py-1 bg-white text-slate-900 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger PDF</span>
                    </Link>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 text-xs">
                  <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1 font-medium">Émetteur</span>
                    <p className="font-bold text-white text-sm">Studio Agence Bamako</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      NINEA : 0089234923 | Bamako, Mali
                    </p>
                  </div>
                  <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1 font-medium">Destinataire</span>
                    <p className="font-bold text-white text-sm">Groupe Ivoire Distribution</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Plateau, Abidjan • contact@ivoiredistrib.ci
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-6 scrollbar-thin">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-medium">
                        <th className="pb-3">Désignation</th>
                        <th className="pb-3 text-center">Qté</th>
                        <th className="pb-3 text-right">Prix Unitaire</th>
                        <th className="pb-3 text-right">Montant HT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      <tr>
                        <td className="py-3 font-medium">Refonte ergonomique site e-commerce & UX</td>
                        <td className="py-3 text-center">1</td>
                        <td className="py-3 text-right font-mono">1 500 000 FCFA</td>
                        <td className="py-3 text-right font-mono font-medium text-white">
                          1 500 000 FCFA
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Intégration passerelle Mobile Money (Wave / OM)</td>
                        <td className="py-3 text-center">1</td>
                        <td className="py-3 text-right font-mono">500 000 FCFA</td>
                        <td className="py-3 text-right font-mono font-medium text-white">
                          500 000 FCFA
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Automated Tax Summary */}
                <div className="flex flex-col sm:flex-row items-end justify-between pt-4 border-t border-slate-800 gap-4">
                  <div className="text-xs text-slate-400 self-start">
                    <p className="font-medium text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Calcul conforme aux règles fiscales UEMOA
                    </p>
                    <p className="mt-1 text-[11px]">
                      Paiement attendu sous 15 jours par virement ou Wave.
                    </p>
                  </div>

                  <div className="w-full sm:w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Brut HT</span>
                      <span className="font-mono text-white">2 000 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-blue-400 font-semibold bg-blue-500/10 px-2 py-1 rounded">
                      <span>TVA Légale (18%)</span>
                      <span className="font-mono">+ 360 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                      <span>TOTAL TTC</span>
                      <span className="font-mono text-emerald-400 text-base">2 360 000 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Quick Insights & Actions */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                    Relances automatiques
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-amber-400">Échéance à J-2</span>
                        <span className="text-[10px] text-amber-300 font-semibold">Automatisé</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Rappel doux WhatsApp envoyé à Ets. Diallo.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">Lien de paiement Wave</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Actif</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Paiement en 1 clic sans saisie d'IBAN fastidieuse.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview Card */}
                <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Disponible partout</h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Créez et envoyez vos factures directement depuis votre smartphone sur le terrain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

