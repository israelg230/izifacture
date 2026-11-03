"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { StatusBadge, PaymentMethodBadge } from "@/components/ui/StatusBadge";
import { DatePicker } from "@/components/ui/DatePicker";
import { useApp } from "@/lib/store-context";
import { Invoice, InvoiceStatus } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import {
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle,
  Trash2,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from "lucide-react";

export default function InvoicesListPage() {
  const router = useRouter();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useApp();

  const [activeFilter, setActiveFilter] = useState<"all" | InvoiceStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount" | "number">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Summary Metrics
  const totalBilled = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + i.balanceDue, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.balanceDue, 0);

  // Status Counts
  const counts = {
    all: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    draft: invoices.filter((i) => i.status === "draft").length,
  };

  // Filtered & Sorted Invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        // Status tab filter
        if (activeFilter !== "all" && inv.status !== activeFilter) {
          return false;
        }
        // Search filter (client name, company, number, city)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCompany = inv.client.companyName.toLowerCase().includes(q);
          const matchName = inv.client.name.toLowerCase().includes(q);
          const matchNumber = inv.number.toLowerCase().includes(q);
          const matchCity = inv.client.city.toLowerCase().includes(q);
          return matchCompany || matchName || matchNumber || matchCity;
        }
        // Date filter
        if (dateFilter) {
          if (inv.issueDate !== dateFilter && inv.dueDate !== dateFilter) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "amount") {
          return sortDirection === "asc" ? a.total - b.total : b.total - a.total;
        }
        if (sortField === "number") {
          return sortDirection === "asc"
            ? a.number.localeCompare(b.number)
            : b.number.localeCompare(a.number);
        }
        // Date sort
        return sortDirection === "asc"
          ? new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
          : new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      });
  }, [invoices, activeFilter, searchQuery, dateFilter, sortField, sortDirection]);

  const toggleSort = (field: "date" | "amount" | "number") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleRowClick = (invoiceId: string) => {
    router.push(`/factures/${invoiceId}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string, number: string) => {
    e.stopPropagation();
    if (confirm(`Confirmez-vous la suppression définitive de la facture ${number} ?`)) {
      deleteInvoice(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar */}
      <SidebarRail />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav activeTab="invoices" />
        <TopNav activeTab="invoices" />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Gestion Commerciale
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-500 font-medium">Zone UEMOA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                Toutes les Factures
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Générez, filtrez et suivez vos encaissements clients en FCFA.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/factures/nouvelle"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                <span>Nouvelle facture</span>
              </Link>
            </div>
          </div>

          {/* 4 Key Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* 1. Total Facturé */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Facturé ({invoices.length})
              </span>
              <span className="text-lg sm:text-2xl font-light text-slate-950 font-display tracking-tight block mt-1">
                {formatFCFA(totalBilled)}
              </span>
            </div>

            {/* 2. Encaissé */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Encaissé ({counts.paid})
              </span>
              <span className="text-lg sm:text-2xl font-light text-emerald-800 font-display tracking-tight block mt-1">
                {formatFCFA(totalPaid)}
              </span>
            </div>

            {/* 3. En attente */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                En attente ({counts.sent})
              </span>
              <span className="text-lg sm:text-2xl font-light text-amber-800 font-display tracking-tight block mt-1">
                {formatFCFA(totalPending)}
              </span>
            </div>

            {/* 4. En retard */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                En retard ({counts.overdue})
              </span>
              <span className="text-lg sm:text-2xl font-light text-rose-800 font-display tracking-tight block mt-1">
                {formatFCFA(totalOverdue)}
              </span>
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                    activeFilter === "all"
                      ? "bg-[#111318] text-white border border-[#111318] shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Toutes ({counts.all})
                </button>

                <button
                  onClick={() => setActiveFilter("paid")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                    activeFilter === "paid"
                      ? "bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  Payées ({counts.paid})
                </button>

                <button
                  onClick={() => setActiveFilter("sent")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                    activeFilter === "sent"
                      ? "bg-amber-600 text-white border border-amber-600 shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  Envoyées ({counts.sent})
                </button>

                <button
                  onClick={() => setActiveFilter("overdue")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                    activeFilter === "overdue"
                      ? "bg-rose-600 text-white border border-rose-600 shadow-sm"
                      : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  En retard ({counts.overdue})
                </button>

                <button
                  onClick={() => setActiveFilter("draft")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                    activeFilter === "draft"
                      ? "bg-slate-800 text-white border border-slate-800 shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Brouillons ({counts.draft})
                </button>
              </div>

              {/* Search & Date Filter (matching user's calendar dropdown) */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
                <div className="relative group w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher client, n°, ville..."
                    className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="w-full sm:w-52">
                  <DatePicker
                    value={dateFilter}
                    onChange={setDateFilter}
                    placeholder="Select dates"
                    showRangeSuffix={true}
                    align="right"
                  />
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-slate-900"
                      onClick={() => toggleSort("number")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Numéro</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3">Client</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-slate-900"
                      onClick={() => toggleSort("date")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Émission</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3">Échéance</th>
                    <th className="py-3 px-3">Règlement</th>
                    <th
                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-900"
                      onClick={() => toggleSort("amount")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Montant TTC</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">Statut</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => handleRowClick(inv.id)}
                        className="hover:bg-violet-50/25 transition-all duration-150 group cursor-pointer"
                      >
                        {/* Numéro */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200 group-hover:bg-violet-50 group-hover:text-violet-900 group-hover:border-violet-300 group-hover:scale-105 transition-all duration-200">
                            {inv.number}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-3 min-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full ${inv.client.avatarColor || "bg-violet-600"} text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
                            >
                              {inv.client.initials}
                            </div>
                            <div className="min-w-0 max-w-[220px]">
                              <p className="font-bold text-slate-900 truncate group-hover:text-violet-950 transition-colors">
                                {inv.client.companyName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {inv.client.name} · {inv.client.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date émission */}
                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          {formatDateFR(inv.issueDate)}
                        </td>

                        {/* Date échéance */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={
                              inv.status === "overdue"
                                ? "font-bold text-rose-700"
                                : "text-slate-600"
                            }
                          >
                            {formatDateFR(inv.dueDate)}
                          </span>
                        </td>

                        {/* Règlement */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <PaymentMethodBadge method={inv.paymentMethod} />
                        </td>

                        {/* Montant TTC */}
                        <td className="py-3.5 px-3 text-right font-display whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {formatFCFA(inv.total)}
                          </span>
                          {inv.balanceDue > 0 && inv.balanceDue < inv.total && (
                            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                              Reste : {formatFCFA(inv.balanceDue)}
                            </p>
                          )}
                        </td>

                        {/* Statut Badge */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <StatusBadge status={inv.status} />
                        </td>

                        {/* Actions buttons */}
                        <td
                          className="py-3.5 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {/* Voir */}
                            <Link
                              href={`/factures/${inv.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 hover:scale-110 active:scale-90 transition-all duration-150"
                              title="Consulter la facture"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Encaisser */}
                            {inv.status !== "paid" && (
                              <button
                                onClick={() => updateInvoiceStatus(inv.id, "paid")}
                                className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:scale-110 active:scale-90 transition-all duration-150"
                                title="Marquer comme payée"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Supprimer */}
                            <button
                              onClick={(e) => handleDelete(e, inv.id, inv.number)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 active:scale-90 transition-all duration-150"
                              title="Supprimer la facture"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                          <FileText className="w-8 h-8 stroke-[1.5]" />
                          <p className="text-sm font-bold text-slate-700">
                            Aucune facture trouvée
                          </p>
                          <p className="text-xs text-slate-400">
                            Essayez de modifier votre recherche ou ajoutez une nouvelle facture.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
