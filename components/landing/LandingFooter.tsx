"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowUpRight, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 text-sm relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Top Status & Brand Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 mb-12 border-b border-slate-900 gap-4">
          <Link href="/" className="flex items-center gap-3 group inline-flex select-none">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-display font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
              iF
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-white tracking-tight flex items-center gap-0.5">
                izi<span className="text-blue-500">Facture</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                La référence de facturation en Afrique
              </span>
            </div>
          </Link>

          {/* Operational live status indicator */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium">Infrastructure 100% opérationnelle • Uptime 99.9%</span>
          </div>
        </div>

        {/* 4 Airy Columns (Eliminating dense block of text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
          {/* Col 1: Mission Card & Quick WhatsApp Action (Span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl footer-card">
            <div>
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                La solution de facturation SaaS d'excellence pour entrepreneurs, agences et PME en Afrique francophone. Calibrée pour le FCFA et conforme OHADA.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-200 text-xs border border-slate-700/80 mb-6">
                <span>🌍</span>
                <span className="font-semibold">Fait avec fierté en Afrique</span>
              </div>
            </div>

            {/* Direct Support Card with Animation */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Assistance instantanée
              </p>
              <a
                href="https://wa.me/2250788451290"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 group shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Discuter avec un conseiller WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Produit (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4 pl-2 border-l-2 border-blue-500">
              Plateforme
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#fonctionnalites" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Factures professionnelles</span>
                </a>
              </li>
              <li>
                <a href="#tarification" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Tarifs en FCFA</span>
                </a>
              </li>
              <li>
                <a href="#comment-ca-marche" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Cycle Devis & Acomptes</span>
                </a>
              </li>
              <li>
                <Link href="/connexion" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Calculateur TVA 18% UEMOA</span>
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Paiements Mobile Money</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ressources & Conformité (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4 pl-2 border-l-2 border-emerald-500">
              Ressources & Conformité
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#probleme" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Normes OHADA & Fiscalité</span>
                </a>
              </li>
              <li>
                <Link href="/aide" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Centre d'aide & FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/aide" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Guide de démarrage rapide</span>
                </Link>
              </li>
              <li>
                <Link href="/aide" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Sécurité & Chiffrement cloud</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/2250788451290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-item"
                >
                  <span className="footer-link-bullet" />
                  <span>Support technique 7j/7</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Écosystème & Légal (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4 pl-2 border-l-2 border-violet-500">
              Intégrations
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#fonctionnalites" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Wave Côte d'Ivoire & SN</span>
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Orange Money</span>
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>MTN MoMo</span>
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="footer-link-item">
                  <span className="footer-link-bullet" />
                  <span>Virement bancaire (RIB)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Financial Details */}
        <div className="pt-8 border-t border-slate-900/90 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} iziFacture Technologies SAS. Tous droits réservés.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Devise officielle : Franc CFA (XOF)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400">
            <Link href="/aide" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/aide" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/aide" className="hover:text-white transition-colors">
              Conditions Générales (CGV)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
