"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  ArrowUpDown,
  FileText,
  Plus,
} from "lucide-react";
import { Invoice } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import { StatusBadge, PaymentMethodBadge } from "@/components/ui/StatusBadge";
import { DatePicker } from "@/components/ui/DatePicker";

interface InvoicesTableProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onNewInvoice: () => void;
  onMarkAsPaid?: (invoiceId: string) => void;
}

type FilterTab = "all" | "paid" | "sent" | "overdue" | "draft";

export function InvoicesTable({
  invoices,
  onSelectInvoice,
  onNewInvoice,
  onMarkAsPaid,
}: InvoicesTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount" | "number">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter & Search Logic
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        if (activeFilter !== "all" && inv.status !== activeFilter) {
          return false;
        }
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchNumber = inv.number.toLowerCase().includes(q);
          const matchClient = inv.client.name.toLowerCase().includes(q);
          const matchCompany = inv.client.companyName.toLowerCase().includes(q);
          const matchProject = inv.projectTitle.toLowerCase().includes(q);
          return matchNumber || matchClient || matchCompany || matchProject;
        }
        if (dateFilter && inv.issueDate !== dateFilter && inv.dueDate !== dateFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === "amount") {
          return sortDirection === "desc"
            ? b.total - a.total
            : a.total - b.total;
        }
        if (sortField === "number") {
          return sortDirection === "desc"
            ? b.number.localeCompare(a.number)
            : a.number.localeCompare(b.number);
        }
        return sortDirection === "desc"
          ? new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          : new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
      });
  }, [invoices, activeFilter, searchQuery, dateFilter, sortField, sortDirection]);

  const counts = useMemo(() => {
    return {
      all: invoices.length,
      paid: invoices.filter((i) => i.status === "paid").length,
      sent: invoices.filter((i) => i.status === "sent").length,
      overdue: invoices.filter((i) => i.status === "overdue").length,
      draft: invoices.filter((i) => i.status === "draft").length,
    };
  }, [invoices]);

  const handleSort = (field: "date" | "amount" | "number") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200">
      {/* Header: Title + Flat Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Dernières factures émises
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos encaissements, relances et factures en FCFA
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("Exportation CSV / Excel des factures")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exporter</span>
          </button>

          <button
            onClick={onNewInvoice}
            className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold border border-transparent shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Nouvelle facture</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar with Animated Loupe */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        {/* Pills filter tabs */}
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

        {/* Search & Date Filter (matching calendar dropdown) */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          {/* Loupe Icon with animated focus state */}
          <div className="relative group w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher client, numéro..."
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

      {/* Table Container - Mobile-first Horizontal Scroll without overflow */}
      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 mt-3 scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th
                onClick={() => handleSort("number")}
                className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>N° Facture</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="py-3 px-3">Client</th>

              <th
                onClick={() => handleSort("date")}
                className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Émission</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="py-3 px-3">Échéance</th>

              <th className="py-3 px-3">Règlement</th>

              <th
                onClick={() => handleSort("amount")}
                className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors select-none text-right"
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
                  className="hover:bg-violet-50/25 transition-all duration-150 group cursor-pointer"
                  onClick={() => onSelectInvoice(inv)}
                >
                  {/* Number as flat chip */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200 group-hover:bg-violet-50 group-hover:text-violet-900 group-hover:border-violet-300 group-hover:scale-105 transition-all duration-200">
                      {inv.number}
                    </span>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-3 min-w-[180px]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${inv.client.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
                      >
                        {inv.client.initials}
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <p className="font-bold text-slate-900 truncate group-hover:text-violet-950 transition-colors">
                          {inv.client.companyName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {inv.client.name} · {inv.client.city}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Issue Date */}
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {formatDateFR(inv.issueDate)}
                  </td>

                  {/* Due Date */}
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

                  {/* Payment Method Badge */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <PaymentMethodBadge method={inv.paymentMethod} />
                  </td>

                  {/* Amount in FCFA */}
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

                  {/* Status as Pill */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Actions buttons */}
                  <td
                    className="py-3.5 px-3 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 hover:scale-110 active:scale-90 transition-all duration-150"
                        title="Voir la facture"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {inv.status !== "paid" && onMarkAsPaid && (
                        <button
                          onClick={() => onMarkAsPaid(inv.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:scale-110 active:scale-90 transition-all duration-150"
                          title="Encaisser le règlement"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Téléchargement du PDF pour ${inv.number}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 hover:scale-110 active:scale-90 transition-all duration-150"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FileText className="w-8 h-8 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-700">
                      Aucune facture trouvée
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Essayez de modifier votre recherche ou le filtre de statut
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <span>
          Affichage de{" "}
          <strong className="text-slate-900 font-bold">{filteredInvoices.length}</strong> sur{" "}
          <strong className="text-slate-900 font-bold">{invoices.length}</strong> factures
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled
            className="px-3 py-1 rounded-xl border border-slate-200 text-slate-400 text-xs cursor-not-allowed bg-slate-50"
          >
            Précédent
          </button>
          <span className="px-2 font-bold text-slate-900">1</span>
          <button
            disabled
            className="px-3 py-1 rounded-xl border border-slate-200 text-slate-400 text-xs cursor-not-allowed bg-slate-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
