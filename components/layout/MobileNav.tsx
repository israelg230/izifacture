"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Plus,
  Coins,
  PhoneCall,
  PieChart,
  Calculator,
  Settings,
  HelpCircle,
  Calendar,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface MobileNavProps {
  onNewInvoiceClick?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function MobileNav({
  onNewInvoiceClick,
  activeTab = "dashboard",
  onTabChange,
}: MobileNavProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const userInitials = (user?.fullName || "IG")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const drawerNavItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "invoices", label: "Factures", icon: FileText, badge: "5" },
    { id: "customers", label: "Clients", icon: Users },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "relances", label: "Relances", icon: PhoneCall, badge: "2" },
    { id: "reports", label: "Rapports", icon: PieChart },
  ];

  const handleSelect = (id: string) => {
    if (onTabChange) onTabChange(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Top Header (Fixed top on mobile/tablet) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0">
              i
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
              izi facture
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewInvoiceClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Facture</span>
          </button>
          <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {userInitials}
          </div>
        </div>
      </div>

      {/* 2. Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-50 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 border-r border-slate-200 p-6 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-extrabold shrink-0">
                i
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base">izi facture</span>
                <span className="block text-[10px] text-slate-500 font-medium">Zone UEMOA / CEMAC</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              IG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Israel G.</p>
              <p className="text-[11px] text-slate-500 truncate">Afrik Innovations SARL</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Entreprise Vérifiée
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 flex flex-col gap-1">
            {[
              { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
              { label: "Factures", href: "/factures", icon: FileText, badge: "5" },
              { label: "Clients", href: "/clients", icon: Users },
              { label: "Devis", href: "/devis", icon: Calculator },
              { label: "Paiements", href: "/clients?tab=paiements", icon: CreditCard },
              { label: "Relances", href: "/clients?tab=relances", icon: PhoneCall, badge: "2" },
              { label: "Échéances", href: "/clients?tab=echeances", icon: Calendar },
              { label: "Rapports", href: "/clients?tab=rapports", icon: PieChart },
              { label: "Paramètres", href: "/parametres", icon: Settings },
              { label: "Aide & Support", href: "/aide", icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label.toLowerCase();
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#111318] text-white border border-[#111318]"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-rose-100 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-500" /> Devise active
            </span>
            <span className="font-bold text-slate-800">FCFA (XOF)</span>
          </div>
          {onNewInvoiceClick ? (
            <button
              onClick={() => {
                setIsOpen(false);
                onNewInvoiceClick();
              }}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </button>
          ) : (
            <Link
              href="/factures/nouvelle"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </Link>
          )}

          {/* User Profile & Logout in Drawer */}
          <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userInitials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user?.fullName || "Israel G."}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user?.companyName || "Afrik Innovations"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-1 p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[11px]">Quitter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Docked Mobile Bottom Navigation Bar (Pixel-perfect Grid 5 columns) */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
        aria-label="Navigation mobile basse"
      >
        <div className="grid grid-cols-5 items-center h-15 max-w-md mx-auto px-1">
          {/* Tab 1: Accueil */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1.5 min-w-0 transition-colors ${
              activeTab === "dashboard" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="text-[10px] truncate max-w-full px-0.5 mt-1">
              Accueil
            </span>
          </Link>

          {/* Tab 2: Factures */}
          <Link
            href="/factures"
            className={`flex flex-col items-center justify-center py-1.5 min-w-0 transition-colors ${
              activeTab === "invoices" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="text-[10px] truncate max-w-full px-0.5 mt-1">
              Factures
            </span>
          </Link>

          {/* Tab 3: Center Action Button (+) */}
          {onNewInvoiceClick ? (
            <button
              onClick={onNewInvoiceClick}
              className="flex flex-col items-center justify-center min-w-0 group"
              aria-label="Créer une facture"
            >
              <div className="w-10 h-10 -mt-4 rounded-full bg-[#111318] group-hover:bg-violet-600 group-active:bg-violet-700 text-white flex items-center justify-center ring-4 ring-white shadow-md group-hover:shadow-violet-500/30 group-active:scale-90 transition-all duration-200">
                <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-bold text-slate-800 group-hover:text-violet-600 tracking-tight mt-0.5 transition-colors">
                Créer
              </span>
            </button>
          ) : (
            <Link
              href="/factures/nouvelle"
              className="flex flex-col items-center justify-center min-w-0 group"
              aria-label="Créer une facture"
            >
              <div className="w-10 h-10 -mt-4 rounded-full bg-[#111318] group-hover:bg-violet-600 group-active:bg-violet-700 text-white flex items-center justify-center ring-4 ring-white shadow-md group-hover:shadow-violet-500/30 group-active:scale-90 transition-all duration-200">
                <Plus className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-bold text-slate-800 group-hover:text-violet-600 tracking-tight mt-0.5 transition-colors">
                Créer
              </span>
            </Link>
          )}

          {/* Tab 4: Clients */}
          <Link
            href="/clients"
            className={`flex flex-col items-center justify-center py-1.5 min-w-0 transition-colors ${
              activeTab === "customers" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="text-[10px] truncate max-w-full px-0.5 mt-1">
              Clients
            </span>
          </Link>

          {/* Tab 5: Paiements */}
          <Link
            href="/clients?tab=paiements"
            className={`flex flex-col items-center justify-center py-1.5 min-w-0 transition-colors ${
              activeTab === "payments" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="text-[10px] truncate max-w-full px-0.5 mt-1">
              Paiements
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
