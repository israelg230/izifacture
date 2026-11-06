"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { StatCard } from "@/components/dashboard/StatCard";
import { FocusInvoiceCard } from "@/components/dashboard/FocusInvoiceCard";
import { UpcomingInvoicesCard } from "@/components/dashboard/UpcomingInvoicesCard";
import { RecentPaymentsCard } from "@/components/dashboard/RecentPaymentsCard";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";
import { InvoiceDetailModal } from "@/components/dashboard/InvoiceDetailModal";
import { NewInvoiceModal } from "@/components/dashboard/NewInvoiceModal";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  StatCardsSkeleton,
  HighlightCardsSkeleton,
  TableSkeleton,
} from "@/components/dashboard/DashboardSkeleton";

import { Invoice } from "@/lib/types";
import { formatFCFA } from "@/lib/money";
import { useApp } from "@/lib/store-context";
import { Plus, CheckCircle2, RefreshCw, Calendar } from "lucide-react";

export default function DashboardPage() {
  // Starts in loading state so skeleton appears on initial load / refresh
  const [isLoading, setIsLoading] = useState(true);
  const { invoices, updateInvoiceStatus, addInvoice, clients, payments, refreshData } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<"overview" | "pending" | "payments" | "overdue">("overview");

  // Date / Period Filter State
  const [periodFilter, setPeriodFilter] = useState<
    "all" | "this_month" | "last_month" | "this_quarter" | "this_year" | "custom"
  >("all");
  const [customDate, setCustomDate] = useState<string>("");

  // Initial load: display skeleton loader then transition to real content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Action: refresh trigger that re-fetches strictly from Supabase
  const handleRefresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
    showToast("Données synchronisées avec la base de données Supabase");
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    await updateInvoiceStatus(invoiceId, "paid");
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: "paid" as const,
              amountPaid: prev.total,
              balanceDue: 0,
            }
          : null
      );
    }
  };

  const handleAddInvoice = async (newInv: Invoice) => {
    await addInvoice(newInv);
  };

  // Filter invoices and payments by the chosen period
  const { filteredInvoices, filteredPayments } = useMemo(() => {
    if (periodFilter === "all") {
      return { filteredInvoices: invoices, filteredPayments: payments };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const matchDate = (dateStr?: string) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;

      if (periodFilter === "this_month") {
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      }
      if (periodFilter === "last_month") {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const year = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getFullYear() === year && d.getMonth() === lastMonth;
      }
      if (periodFilter === "this_quarter") {
        const currentQuarter = Math.floor(currentMonth / 3);
        const itemQuarter = Math.floor(d.getMonth() / 3);
        return d.getFullYear() === currentYear && itemQuarter === currentQuarter;
      }
      if (periodFilter === "this_year") {
        return d.getFullYear() === currentYear;
      }
      if (periodFilter === "custom" && customDate) {
        return dateStr.startsWith(customDate);
      }
      return true;
    };

    const finv = invoices.filter((i) => matchDate(i.issueDate) || matchDate(i.dueDate));
    const fpay = payments.filter((p) => matchDate(p.date));

    return { filteredInvoices: finv, filteredPayments: fpay };
  }, [invoices, payments, periodFilter, customDate]);

  // Live dynamic totals calculated from real invoices of the selected period
  const paidInvoices = filteredInvoices.filter((i) => i.status === "paid");
  const pendingInvoices = filteredInvoices.filter((i) => i.status === "sent");
  const overdueInvoices = filteredInvoices.filter((i) => i.status === "overdue");

  const totalRevenuePaid = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalBilled = filteredInvoices.reduce((sum, i) => sum + i.total, 0);
  const recoveryRate = totalBilled > 0 ? Math.round((totalRevenuePaid / totalBilled) * 100) : 100;

  const displayedInvoices = useMemo(() => {
    if (subTab === "pending") return filteredInvoices.filter((i) => i.status === "sent");
    if (subTab === "overdue") return filteredInvoices.filter((i) => i.status === "overdue");
    if (subTab === "payments") return filteredInvoices.filter((i) => i.status === "paid");
    return filteredInvoices;
  }, [filteredInvoices, subTab]);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar Icon Rail (Flat Design) */}
      <SidebarRail />

      {/* 2. Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header + Slide-over Drawer */}
        <MobileNav
          onNewInvoiceClick={() => setIsNewInvoiceOpen(true)}
          activeTab="dashboard"
        />

        {/* Top Header Navigation (Flat Arched Pill bar) */}
        <TopNav
          onNewInvoiceClick={() => setIsNewInvoiceOpen(true)}
          activeTab="dashboard"
        />

        {/* Dashboard Main View Container */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 sm:space-y-8 pb-28 sm:pb-32 lg:pb-12">
          {/* Section: Sub-nav pills + Page Title + Balance Summary (ALWAYS STABLE) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pt-2 w-full">
            <div>
              {/* Sub-navigation Pill Chips in Flat Design */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200 w-fit max-w-full overflow-x-auto scrollbar-none mb-3">
                <button
                  onClick={() => setSubTab("overview")}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                    subTab === "overview"
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setSubTab("pending")}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                    subTab === "pending"
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Factures en attente
                </button>
                <button
                  onClick={() => setSubTab("payments")}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                    subTab === "payments"
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Règlements récents
                </button>
                <button
                  onClick={() => setSubTab("overdue")}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
                    subTab === "overdue"
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  À relancer ({overdueInvoices.length})
                </button>
              </div>

              {/* Large Page Title with Date / Period Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                  Tableau de bord
                </h1>

                {/* Sélecteur de période / date */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit mt-1 sm:mt-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 pl-1.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <select
                      value={periodFilter}
                      onChange={(e) => setPeriodFilter(e.target.value as any)}
                      className="bg-transparent text-xs font-bold text-slate-800 pr-1 focus:outline-none cursor-pointer"
                    >
                      <option value="all">Toutes les périodes</option>
                      <option value="this_month">Ce mois-ci</option>
                      <option value="last_month">Mois dernier</option>
                      <option value="this_quarter">Ce trimestre</option>
                      <option value="this_year">Cette année</option>
                      <option value="custom">Date précise...</option>
                    </select>
                  </div>

                  {periodFilter === "custom" && (
                    <div className="w-36 border-l border-slate-200 pl-2">
                      <DatePicker
                        value={customDate}
                        onChange={setCustomDate}
                        placeholder="AAAA-MM-JJ"
                      />
                    </div>
                  )}

                  {periodFilter !== "all" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-50 text-violet-700 rounded-lg shrink-0">
                      {filteredInvoices.length} fact.
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Suivez votre trésorerie, vos encaissements et vos relances en FCFA.
              </p>
            </div>

            {/* Right: Controls & Available Balance */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Button: Refresh with animated spin and guaranteed transition */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isLoading
                    ? "bg-violet-50 border-violet-300 text-violet-700 cursor-wait shadow-sm"
                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
                title="Actualiser les données (active le Skeleton loader)"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isLoading ? "animate-spin text-violet-600" : ""
                  }`}
                />
                <span>{isLoading ? "Actualisation..." : "Actualiser"}</span>
              </button>

              {/* Balance Card */}
              <div className="group flex items-center gap-4 bg-white px-5 py-2.5 rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-card-hover transition-all duration-300">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Solde disponible
                  </span>
                  <span className="text-lg sm:text-xl font-light text-slate-950 font-display tracking-tight group-hover:text-violet-950 transition-colors">
                    {formatFCFA(totalRevenuePaid)}
                  </span>
                </div>
                <button
                  onClick={() => setIsNewInvoiceOpen(true)}
                  className="group w-9 h-9 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white flex items-center justify-center shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200 shrink-0"
                  title="Créer une nouvelle facture"
                >
                  <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Skeleton or Content Transition Container */}
          {isLoading ? (
            /* Skeleton Loading State with pulse */
            <div key="skeleton-view" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              <StatCardsSkeleton />
              <HighlightCardsSkeleton />
              <TableSkeleton />
            </div>
          ) : (
            /* Real Live Data Dashboard with smooth fade-in */
            <div key="content-view" className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              {/* 3. The 4 StatCards Grid in Flat Design */}
              <section aria-label="Statistiques clés">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Card 1: Chiffre d'Affaires Encaissé */}
                  <StatCard
                    title="Encaissé ce mois"
                    amount={totalRevenuePaid}
                    subtitle={`${paidInvoices.length} facture${paidInvoices.length > 1 ? "s" : ""} soldée${paidInvoices.length > 1 ? "s" : ""}`}
                    badge={{
                      text: `${recoveryRate}% réglé`,
                      variant: "success",
                    }}
                    iconType="revenue"
                    onActionClick={() => showToast("Exportation du rapport mensuel d'encaissement")}
                  />

                  {/* Card 2: En attente de paiement */}
                  <StatCard
                    title="En attente de paiement"
                    amount={totalPending}
                    subtitle={`${pendingInvoices.length} facture${pendingInvoices.length > 1 ? "s" : ""} émise${pendingInvoices.length > 1 ? "s" : ""}`}
                    badge={{
                      text: `${pendingInvoices.length} en cours`,
                      variant: "warning",
                    }}
                    iconType="pending"
                    onActionClick={() => showToast("Filtrage des factures en attente")}
                  />

                  {/* Card 3: Factures en retard */}
                  <StatCard
                    title="Factures en retard"
                    amount={totalOverdue}
                    subtitle={`${overdueInvoices.length} relance${overdueInvoices.length > 1 ? "s" : ""} prioritaire${overdueInvoices.length > 1 ? "s" : ""}`}
                    badge={{
                      text: overdueInvoices.length > 0 ? `${overdueInvoices.length} en retard` : "À jour",
                      variant: overdueInvoices.length > 0 ? "danger" : "success",
                    }}
                    iconType="overdue"
                    onActionClick={() => showToast("Relances automatiques par WhatsApp & Email prêtes !")}
                  />

                  {/* Card 4: Total Facturé Annuel */}
                  <StatCard
                    title={`Total facturé (${new Date().getFullYear()})`}
                    amount={totalBilled}
                    subtitle={`${filteredInvoices.length} facture${filteredInvoices.length > 1 ? "s" : ""} créée${filteredInvoices.length > 1 ? "s" : ""}`}
                    badge={{
                      text: `${filteredInvoices.length} document${filteredInvoices.length > 1 ? "s" : ""}`,
                      variant: "purple",
                    }}
                    iconType="total"
                    onActionClick={() => showToast("Historique annuel de facturation")}
                  />
                </div>
              </section>

              {/* 4. Highlight Cards (Focus Factures + Échéances + Règlements) */}
              <section aria-label="Aperçus et règlements">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <FocusInvoiceCard
                    invoices={filteredInvoices.filter((i) => i.status === "sent" || i.status === "overdue")}
                    onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                    onNewInvoice={() => setIsNewInvoiceOpen(true)}
                  />

                  <UpcomingInvoicesCard
                    invoices={filteredInvoices.filter((i) => i.status !== "paid")}
                    onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                    onNewInvoice={() => setIsNewInvoiceOpen(true)}
                  />

                  <RecentPaymentsCard
                    payments={filteredPayments}
                    onViewAll={() => showToast("Historique complet des règlements")}
                  />
                </div>
              </section>

              {/* 5. Invoices Table in Flat Design with Animated Loupe & Pill Badges */}
              <section id="factures" aria-label="Liste des factures">
                <InvoicesTable
                  invoices={displayedInvoices}
                  onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                  onNewInvoice={() => setIsNewInvoiceOpen(true)}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              </section>
            </div>
          )}
        </main>
      </div>

      {/* 6. Invoice Details Modal (Flat Design) */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* 7. New Invoice Modal (Flat Design) */}
      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        clients={clients}
        onAddInvoice={handleAddInvoice}
      />

      {/* 8. Flat Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#111318] text-white text-xs font-bold rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
