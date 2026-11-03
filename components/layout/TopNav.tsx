"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Plus,
  Coins,
  CheckCircle2,
  LogOut,
  Settings,
  HelpCircle,
  FileText,
  Users,
  FileCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useApp } from "@/lib/store-context";
import { formatFCFA } from "@/lib/money";

interface TopNavProps {
  onNewInvoiceClick?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navTabs = [
  { id: "dashboard", label: "Tableau de bord", href: "/" },
  { id: "invoices", label: "Factures", href: "/factures" },
  { id: "customers", label: "Clients", href: "/clients" },
  { id: "estimates", label: "Devis", href: "/devis" },
  { id: "payments", label: "Paiements", href: "/clients?tab=paiements" },
];

export function TopNav({
  onNewInvoiceClick,
  activeTab = "dashboard",
  onTabChange,
}: TopNavProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { companySettings, invoices, clients, quotes } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered results from real database entities
  const searchResults = useMemo(() => {
    const q = topSearchQuery.trim().toLowerCase();
    if (!q) return { invoices: [], clients: [], quotes: [] };

    const matchingInvoices = invoices
      .filter(
        (inv) =>
          inv.number.toLowerCase().includes(q) ||
          inv.client.name.toLowerCase().includes(q) ||
          inv.client.companyName.toLowerCase().includes(q) ||
          inv.projectTitle.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchingClients = clients
      .filter(
        (cli) =>
          cli.name.toLowerCase().includes(q) ||
          cli.companyName.toLowerCase().includes(q) ||
          cli.city.toLowerCase().includes(q) ||
          cli.phone.toLowerCase().includes(q) ||
          cli.email.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchingQuotes = quotes
      .filter(
        (quo) =>
          quo.number.toLowerCase().includes(q) ||
          quo.client.name.toLowerCase().includes(q) ||
          quo.client.companyName.toLowerCase().includes(q) ||
          quo.projectTitle.toLowerCase().includes(q)
      )
      .slice(0, 3);

    return {
      invoices: matchingInvoices,
      clients: matchingClients,
      quotes: matchingQuotes,
    };
  }, [topSearchQuery, invoices, clients, quotes]);

  const hasAnyResults =
    searchResults.invoices.length > 0 ||
    searchResults.clients.length > 0 ||
    searchResults.quotes.length > 0;

  const userName = user?.fullName || "Israel G.";
  const userCompany = companySettings?.companyName || user?.companyName || "Afrik Innovations";
  const userEmail = user?.email || "contact@afrikinnovations.ci";
  const userInitials = (userName || "IG")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand identity on the left */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-base shrink-0 transition-transform group-hover:scale-105">
              i
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                izi facture
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200 hidden sm:inline-block">
                  UEMOA
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate hidden sm:block">
                Facturation & Trésorerie FCFA
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Flat Arched Pill Nav */}
        <nav
          className="hidden 2xl:flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shrink-0"
          aria-label="Menu principal"
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-[#111318] text-white border border-[#111318]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Search, Currency, Notifications, CTA, Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
          {/* Quick Search with Live Database Dropdown */}
          <div ref={searchContainerRef} className="relative group hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher facture, client, devis..."
              value={topSearchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setTopSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-40 lg:w-56 pl-8 pr-7 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 focus:w-64 transition-all duration-200"
            />
            {topSearchQuery && (
              <button
                onClick={() => {
                  setTopSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Live Search Results Modal / Popover */}
            {isSearchOpen && topSearchQuery.trim() && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 max-h-[480px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Résultats base de données
                  </span>
                  <span className="text-[10px] text-slate-500">
                    &quot;{topSearchQuery}&quot;
                  </span>
                </div>

                {!hasAnyResults ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Aucun résultat trouvé dans la base pour &quot;{topSearchQuery}&quot;
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Factures Section */}
                    {searchResults.invoices.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                          <FileText className="w-3 h-3 text-violet-600" />
                          <span>Factures ({searchResults.invoices.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.invoices.map((inv) => (
                            <button
                              key={inv.id}
                              onClick={() => {
                                router.push(`/factures/${inv.id}`);
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-violet-50/70 border border-transparent hover:border-violet-200 transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <span className="text-xs font-bold text-slate-900 block group-hover:text-violet-900">
                                  {inv.number} — {inv.client.companyName || inv.client.name}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block max-w-[200px]">
                                  {inv.projectTitle}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-slate-900 font-display">
                                {formatFCFA(inv.total)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clients Section */}
                    {searchResults.clients.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                          <Users className="w-3 h-3 text-indigo-600" />
                          <span>Clients ({searchResults.clients.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.clients.map((cli) => (
                            <button
                              key={cli.id}
                              onClick={() => {
                                router.push(`/clients?client=${cli.id}`);
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-200 transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-900">
                                  {cli.companyName || cli.name}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {cli.city} • {cli.phone || cli.email}
                                </span>
                              </div>
                              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Devis Section */}
                    {searchResults.quotes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                          <FileCheck className="w-3 h-3 text-emerald-600" />
                          <span>Devis ({searchResults.quotes.length})</span>
                        </div>
                        <div className="space-y-1">
                          {searchResults.quotes.map((quo) => (
                            <button
                              key={quo.id}
                              onClick={() => {
                                router.push(`/devis`);
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-900">
                                  {quo.number} — {quo.client.companyName || quo.client.name}
                                </span>
                                <span className="text-[10px] text-slate-500 truncate block max-w-[200px]">
                                  {quo.projectTitle}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-slate-900 font-display">
                                {formatFCFA(quo.total)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Currency Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap">
            <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>FCFA (XOF)</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group/bell relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:scale-105 active:scale-95 transition-all duration-200"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 group-hover/bell:rotate-12 transition-transform duration-200" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-white" />
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-violet-600 hover:text-violet-700 font-bold cursor-pointer transition-colors">Tout marquer lu</span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Paiement reçu Wave</p>
                      <p className="text-slate-600 text-[11px]">1 500 000 FCFA reçu de Koffi & Partners</p>
                      <span className="text-[10px] text-slate-400">Il y a 12 min</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-colors">
                    <Bell className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Facture en retard</p>
                      <p className="text-slate-600 text-[11px]">FAC-2024-0040 dépasse 14 jours</p>
                      <span className="text-[10px] text-slate-400">Hier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New Invoice CTA button */}
          {onNewInvoiceClick ? (
            <button
              onClick={onNewInvoiceClick}
              className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">Facture</span>
            </button>
          ) : (
            <Link
              href="/factures/nouvelle"
              className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">Facture</span>
            </Link>
          )}

          {/* User profile with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0 group hover:opacity-90 transition-opacity text-left"
              title="Menu utilisateur"
              aria-label="Menu utilisateur"
            >
              <div className="relative cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs border border-violet-700 shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-200">
                  {userInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors leading-tight truncate max-w-[120px]">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                  {userCompany}
                </span>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 animate-in fade-in duration-200">
                <div className="p-2.5 bg-slate-50 rounded-xl mb-1.5 border border-slate-100">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{userEmail}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-violet-100 text-violet-800 border border-violet-200 truncate max-w-full">
                    {userCompany}
                  </span>
                </div>

                <div className="space-y-0.5 text-xs font-semibold">
                  <Link
                    href="/parametres"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Paramètres de l'entreprise</span>
                  </Link>
                  <Link
                    href="/aide"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Centre d'aide & FAQ</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-bold text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
