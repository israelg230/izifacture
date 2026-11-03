"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calculator,
  CreditCard,
  PieChart,
  Settings,
  Sparkles,
  PhoneCall,
  Calendar,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { label: "Factures", href: "/factures", icon: FileText, badge: "5" },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Devis", href: "/devis", icon: Calculator },
  { label: "Paiements", href: "/clients?tab=paiements", icon: CreditCard },
  { label: "Relances", href: "/clients?tab=relances", icon: PhoneCall, badge: "2" },
  { label: "Échéances", href: "/clients?tab=echeances", icon: Calendar },
  { label: "Rapports", href: "/clients?tab=rapports", icon: PieChart },
];

export function SidebarRail() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className="hidden lg:flex flex-col items-center justify-between py-5 px-3 w-[72px] bg-white border-r border-slate-200 z-30 shrink-0 select-none"
      aria-label="Navigation latérale"
    >
      {/* Top: Logo */}
      <div className="flex flex-col items-center gap-5">
        <Link
          href="/"
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-600 text-white font-extrabold text-xl hover:bg-violet-700 transition-colors"
          title="izi facture"
        >
          <div className="flex items-center tracking-tighter">
            <span className="text-xl font-black">i</span>
            <span className="text-amber-300 text-xs ml-0.5">⚡</span>
          </div>
          <span className="sr-only">izi facture</span>
        </Link>

        {/* Flat Divider */}
        <div className="w-8 h-px bg-slate-200" />

        {/* Flat Nav Items */}
        <nav className="flex flex-col items-center gap-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isActive
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:scale-105" />

                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Flat Tooltip */}
                <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#111318] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 shadow-md">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: AI & Settings */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <Link
            href="/factures"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-amber-400/30"
            aria-label="Assistant IA Facturation"
          >
            <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          </Link>
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#111318] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 shadow-md">
            Assistant izi AI
          </div>
        </div>

        <div className="relative group">
          <Link
            href="/parametres"
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 ${
              pathname.startsWith("/parametres")
                ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Paramètres"
          >
            <Settings className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#111318] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 shadow-md">
            Paramètres
          </div>
        </div>

        <div className="relative group">
          <Link
            href="/aide"
            className={`flex items-center justify-center w-10 h-10 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 ${
              pathname.startsWith("/aide")
                ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Aide et Support"
          >
            <HelpCircle className="w-4 h-4 stroke-[2] transition-transform duration-300 group-hover:scale-110" />
          </Link>
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#111318] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 shadow-md">
            Aide & Support
          </div>
        </div>

        <div className="relative group pt-1 border-t border-slate-200 w-full flex justify-center">
          <button
            onClick={() => logout()}
            className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label="Se déconnecter"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#111318] text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 shadow-md">
            Déconnexion
          </div>
        </div>
      </div>
    </aside>
  );
}
