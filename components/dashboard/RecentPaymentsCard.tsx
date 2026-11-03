"use client";

import React from "react";
import { ArrowUpRight, ArrowUp, Share2, CreditCard } from "lucide-react";
import { Payment } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";

interface RecentPaymentsCardProps {
  payments: Payment[];
  onViewAll?: () => void;
}

export function RecentPaymentsCard({ payments, onViewAll }: RecentPaymentsCardProps) {
  const getMethodLabel = (method: string) => {
    switch (method) {
      case "wave":
        return "Wave CI / SN";
      case "orange_money":
        return "Orange Money";
      case "mtn_momo":
        return "MTN Mobile Money";
      case "bank_transfer":
        return "Virement Bancaire";
      default:
        return "Paiement direct";
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Flat Header */}
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            Derniers Règlements
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Relevé exporté")}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:scale-105 active:scale-95 transition-all duration-200"
              title="Exporter le relevé"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onViewAll}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#111318] hover:text-white border border-slate-200 hover:border-[#111318] flex items-center justify-center text-slate-600 hover:scale-105 active:scale-95 transition-all duration-200"
              title="Voir tout"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Payments list with zero overflow and flat pills */}
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700">Aucun règlement enregistré</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Les encaissements Mobile Money et virements apparaîtront ici.
              </p>
            </div>
          ) : (
            payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 hover:translate-x-1 border border-slate-200/80 gap-3 transition-all duration-200 cursor-default group/item"
            >
              {/* Left: Icon + Label */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                  <ArrowUp className="w-4 h-4 text-emerald-700 group-hover/item:-translate-y-0.5 transition-transform duration-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {getMethodLabel(payment.method)}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {payment.clientName} · {formatDateFR(payment.date)}
                  </p>
                </div>
              </div>

              {/* Right: Amount & Flat Percentage Pill */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-display whitespace-nowrap">
                  {formatFCFA(payment.amount)}
                </span>
                {payment.percentage !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-300 whitespace-nowrap shrink-0 group-hover/item:scale-105 transition-transform duration-200">
                    +{payment.percentage}%
                  </span>
                )}
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Flat Footer */}
      <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="truncate">{payments.length} règlements récents</span>
        <button
          onClick={onViewAll}
          className="font-bold text-slate-900 hover:text-violet-700 whitespace-nowrap ml-2 transition-colors"
        >
          Tous les paiements →
        </button>
      </div>
    </div>
  );
}
