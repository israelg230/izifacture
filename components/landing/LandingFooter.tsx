"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Logo & Mission statement */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-display font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                iF
              </div>
              <span className="font-display font-bold text-xl text-white">
                izi<span className="text-blue-500">Facture</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
              La solution de facturation de référence pour les indépendants, agences et PME en Afrique francophone. Calibré pour le FCFA et conforme OHADA.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs border border-slate-800">
              <span>🌍</span>
              <span className="font-medium">Fait avec fierté en Afrique</span>
            </div>
          </div>

          {/* Links Col 1: Produit */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4">Produit</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#tarification" className="hover:text-white transition-colors">
                  Tarifs en FCFA
                </a>
              </li>
              <li>
                <a href="#comment-ca-marche" className="hover:text-white transition-colors">
                  Modèles de factures
                </a>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Calculateur TVA 18%
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Ressources */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4">Ressources</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/aide" className="hover:text-white transition-colors">
                  Centre d'aide & FAQ
                </Link>
              </li>
              <li>
                <a href="#probleme" className="hover:text-white transition-colors">
                  Guide facturation OHADA
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2250788451290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Support WhatsApp direct
                </a>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Communauté */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-white mb-4">Communauté</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook Business
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2250788451290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Communauté WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} iziFacture Technologies SAS. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/aide" className="hover:text-slate-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/aide" className="hover:text-slate-400 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/aide" className="hover:text-slate-400 transition-colors">
              Conditions Générales de Vente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

