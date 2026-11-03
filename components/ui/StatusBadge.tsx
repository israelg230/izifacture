import React from "react";
import { InvoiceStatus, PaymentMethod } from "@/lib/types";

interface StatusBadgeProps {
  status: InvoiceStatus;
  size?: "sm" | "md" | "lg";
}

/**
 * StatusPill / StatusBadge en Flat Design pur :
 * - Forme de pilule (pill rounded-full)
 * - Vert pour Payée
 * - Orange pour Envoyée
 * - Gris pour Brouillon
 * - Rouge pour En retard
 */
export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    paid: {
      label: "Payée",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-300",
      dot: "bg-emerald-600",
    },
    sent: {
      label: "Envoyée",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
      dot: "bg-amber-500",
    },
    draft: {
      label: "Brouillon",
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      dot: "bg-slate-500",
    },
    overdue: {
      label: "En retard",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-300",
      dot: "bg-rose-600 animate-pulse",
    },
  }[status];

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-xs font-semibold gap-2",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-200 hover:scale-105 select-none ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {status === "overdue" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span className="leading-none whitespace-nowrap">{config.label}</span>
    </span>
  );
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const meta = {
    wave: {
      label: "Wave",
      color: "bg-sky-50 text-sky-800 border-sky-300",
      dot: "bg-sky-500",
    },
    orange_money: {
      label: "Orange Money",
      color: "bg-orange-50 text-orange-900 border-orange-300",
      dot: "bg-orange-500",
    },
    mtn_momo: {
      label: "MTN MoMo",
      color: "bg-yellow-50 text-yellow-900 border-yellow-300",
      dot: "bg-yellow-600",
    },
    moov_money: {
      label: "Moov Money",
      color: "bg-blue-50 text-blue-900 border-blue-300",
      dot: "bg-blue-600",
    },
    bank_transfer: {
      label: "Virement",
      color: "bg-slate-50 text-slate-800 border-slate-300",
      dot: "bg-slate-500",
    },
    cash: {
      label: "Espèces",
      color: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-600",
    },
    check: {
      label: "Chèque",
      color: "bg-purple-50 text-purple-900 border-purple-300",
      dot: "bg-purple-600",
    },
  }[method] || {
    label: method,
    color: "bg-slate-100 text-slate-700 border-slate-300",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border gap-1.5 select-none whitespace-nowrap ${meta.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
      <span className="leading-none">{meta.label}</span>
    </span>
  );
}
