"use client";

import React, { useState } from "react";
import { Plus, ArrowUpRight, Clock, FileText } from "lucide-react";
import { Invoice } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";

interface FocusInvoiceCardProps {
  invoices: Invoice[];
  onSelectInvoice?: (invoice: Invoice) => void;
  onNewInvoice?: () => void;
}

export function FocusInvoiceCard({
  invoices,
  onSelectInvoice,
  onNewInvoice,
}: FocusInvoiceCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentInvoice = invoices[selectedIndex] || invoices[0];

  if (!currentInvoice) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col justify-between min-h-[260px]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            Factures en attente
          </h4>
          <button
            onClick={onNewInvoice}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-violet-600 hover:text-white border border-slate-200 hover:border-violet-600 flex items-center justify-center text-slate-600 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
            title="Créer une facture"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="my-auto py-8 text-center text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
          <p className="text-xs font-bold text-slate-700">Aucune facture en attente</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Toutes vos factures sont réglées ou en brouillon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Flat Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            Factures en attente
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewInvoice}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-violet-600 hover:text-white border border-slate-200 hover:border-violet-600 flex items-center justify-center text-slate-600 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
              title="Créer une facture"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectInvoice && onSelectInvoice(currentInvoice)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#111318] hover:text-white border border-slate-200 hover:border-[#111318] flex items-center justify-center text-slate-600 hover:scale-105 active:scale-95 transition-all duration-200"
              title="Voir les détails"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Flat Chips Row */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
          {invoices.map((inv, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={inv.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ${
                  isSelected
                    ? "bg-violet-600 text-white border border-violet-600 shadow-sm shadow-violet-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {inv.number}
              </button>
            );
          })}
        </div>

        {/* Invoice Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Émise le {formatDateFR(currentInvoice.issueDate)}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
              {currentInvoice.client.initials}
            </div>
          </div>

          <div>
            <h5 className="text-lg sm:text-xl font-medium text-slate-950 tracking-tight leading-snug">
              {currentInvoice.projectTitle}
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              Client :{" "}
              <span className="font-bold text-slate-800">
                {currentInvoice.client.companyName}
              </span>{" "}
              ({currentInvoice.client.city}, {currentInvoice.client.country})
            </p>
          </div>

          {/* Flat Pills for Tags */}
          <div className="flex items-center gap-2 pt-2 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
              Prestation de services
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Priorité {currentInvoice.priority || "Haute"}
            </span>
          </div>
        </div>
      </div>

      {/* Financials footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Montant Total
          </span>
          <span className="text-lg sm:text-xl font-light text-slate-950 font-display">
            {formatFCFA(currentInvoice.total)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Solde Restant Dû
          </span>
          <span className="text-lg sm:text-xl font-bold text-emerald-700 font-display">
            {formatFCFA(currentInvoice.balanceDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
