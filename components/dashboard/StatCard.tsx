import React from "react";
import { ArrowUpRight, TrendingUp, AlertTriangle, Clock, FileCheck } from "lucide-react";
import { formatFCFA } from "@/lib/money";

interface StatCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "danger" | "neutral" | "purple";
  };
  iconType: "revenue" | "pending" | "overdue" | "total";
  onActionClick?: () => void;
}

export function StatCard({
  title,
  amount,
  subtitle,
  badge,
  iconType,
  onActionClick,
}: StatCardProps) {
  const getBadgeStyle = () => {
    switch (badge?.variant) {
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "danger":
        return "bg-rose-50 text-rose-800 border-rose-300";
      case "purple":
        return "bg-violet-50 text-violet-800 border-violet-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getIcon = () => {
    switch (iconType) {
      case "revenue":
        return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-700" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-rose-700" />;
      case "total":
        return <FileCheck className="w-4 h-4 text-violet-700" />;
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 w-full overflow-hidden">
      {/* Top row: Label + Arrow Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            {getIcon()}
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </span>
        </div>

        <button
          onClick={onActionClick}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 group-hover:bg-[#111318] group-hover:text-white border border-slate-200 group-hover:border-[#111318] flex items-center justify-center text-slate-600 transition-all duration-200 shrink-0"
          aria-label={`Détails ${title}`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* Main big amount */}
      <div className="my-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-slate-950 font-display break-words">
          {formatFCFA(amount)}
        </h3>
      </div>

      {/* Bottom row: Flat Pill Badge & Subtitle */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-slate-100">
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border whitespace-nowrap transition-transform duration-200 group-hover:scale-105 ${getBadgeStyle()}`}
          >
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse shrink-0" />
            {badge.text}
          </span>
        )}
        {subtitle && (
          <span className="text-[11px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
