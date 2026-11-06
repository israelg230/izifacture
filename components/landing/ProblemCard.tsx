"use client";

import React from "react";
import { AlertCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

interface ProblemCardProps {
  number: string;
  title: string;
  description: string;
  impact: string;
  badgeVariant?: "rose" | "amber" | "slate";
}

export function ProblemCard({
  number,
  title,
  description,
  impact,
  badgeVariant = "rose",
}: ProblemCardProps) {
  const numberBadgeColors = {
    rose: "bg-rose-100 text-rose-600",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-200 text-slate-800",
  }[badgeVariant];

  const impactColors = {
    rose: "text-rose-600",
    amber: "text-amber-700",
    slate: "text-slate-700",
  }[badgeVariant];

  return (
    <div className="reveal-on-scroll bg-slate-50/75 rounded-2xl p-7 sm:p-8 border border-slate-200/80 hover:border-slate-300 transition-all duration-300 landing-card group flex flex-col justify-between">
      <div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-xl mb-6 landing-card-icon shadow-sm ${numberBadgeColors}`}
        >
          {number}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>
      </div>

      <div
        className={`pt-4 border-t border-slate-200/70 text-xs font-semibold flex items-center gap-1.5 ${impactColors}`}
      >
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Impact : {impact}</span>
      </div>
    </div>
  );
}

