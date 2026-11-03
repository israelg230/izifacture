"use client";

import React, { useState } from "react";
import { Plus, ArrowUpRight, Calendar } from "lucide-react";
import { Invoice } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import { PaymentMethodBadge } from "@/components/ui/StatusBadge";

interface UpcomingInvoicesCardProps {
  invoices: Invoice[];
  onSelectInvoice?: (invoice: Invoice) => void;
  onNewInvoice?: () => void;
}

export function UpcomingInvoicesCard({
  invoices,
  onSelectInvoice,
  onNewInvoice,
}: UpcomingInvoicesCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentInvoice = invoices[selectedIndex] || invoices[0];

  if (!currentInvoice) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col justify-between min-h-[260px]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            Prochaines échéances
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
          <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
          <p className="text-xs font-bold text-slate-700">Aucune échéance à venir</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Créez une facture pour planifier vos encaissements.
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
            Prochaines échéances
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
              title="Consulter"
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

        {/* Content details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Échéance : {formatDateFR(currentInvoice.dueDate)}
            </span>
            <PaymentMethodBadge method={currentInvoice.paymentMethod} />
          </div>

          <div>
            <h5 className="text-lg sm:text-xl font-medium text-slate-950 tracking-tight leading-snug">
              {currentInvoice.client.companyName}
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              {currentInvoice.projectTitle}
            </p>
          </div>

          {/* Flat Pills for Tags */}
          <div className="flex items-center gap-2 pt-2 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              TVA 18% incluse
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Certifiée conforme
            </span>
          </div>
        </div>
      </div>

      {/* Financials footer */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            TVA (18%)
          </span>
          <span className="text-lg sm:text-xl font-light text-slate-600 font-display">
            {formatFCFA(currentInvoice.taxTotal)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Montant TTC
          </span>
          <span className="text-lg sm:text-xl font-bold text-slate-950 font-display">
            {formatFCFA(currentInvoice.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
