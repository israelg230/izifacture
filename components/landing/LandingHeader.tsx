"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Menu, X, ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { HeroPrimaryButton } from "./HeroPrimaryButton";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100/90 landing-header ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between transition-all duration-300">
        {/* Brand Logo with micro-animation */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md landing-logo-icon">
            <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 flex items-center gap-0.5">
              izi<span className="text-blue-600">Facture</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              Afrique de l'Ouest & Centrale
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links with Micro-Animations */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
          <a href="#probleme" className="landing-nav-link">
            Pourquoi nous
          </a>
          <a href="#fonctionnalites" className="landing-nav-link">
            Fonctionnalités
          </a>
          <a href="#comment-ca-marche" className="landing-nav-link">
            Comment ça marche
          </a>
          <a href="#tarification" className="landing-nav-link">
            Tarifs
          </a>
          <a href="#temoignages" className="landing-nav-link">
            Avis clients
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition-all duration-200"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tableau de bord</span>
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100/70 transition-all duration-200"
              >
                Connexion
              </Link>
              <HeroPrimaryButton
                href="/connexion?mode=register"
                size="md"
                variant="dark"
                showArrow={false}
              >
                Essai Gratuit
              </HeroPrimaryButton>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button with Micro-Animation */}
        <div className="flex sm:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold"
              title="Tableau de bord"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Responsive on all mobiles) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-6 py-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-4 text-base font-semibold text-slate-700 pb-6 border-b border-slate-100">
            <a
              href="#probleme"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors py-1"
            >
              Pourquoi nous
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors py-1"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors py-1"
            >
              Comment ça marche
            </a>
            <a
              href="#tarification"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors py-1"
            >
              Tarifs
            </a>
            <a
              href="#temoignages"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors py-1"
            >
              Avis clients
            </a>
          </nav>

          <div className="pt-6 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Accéder à mon Tableau de bord</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Connexion
                </Link>
                <HeroPrimaryButton
                  href="/connexion?mode=register"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Essai Gratuit
                </HeroPrimaryButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

