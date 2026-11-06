"use client";

import React from "react";
import { LucideIcon, ArrowRight } from "lucide-react";

interface FeatureCardProps {
  step: string;
  category: string;
  title: string;
  description: string;
  footerText: string;
  icon: LucideIcon;
  theme: "blue" | "emerald" | "amber" | "indigo";
}

export function FeatureCard({
  step,
  category,
  title,
  description,
  footerText,
  icon: Icon,
  theme,
}: FeatureCardProps) {
  const themeClasses = {
    blue: {
      bg: "bg-blue-50 text-blue-600",
      link: "text-blue-600 hover:text-blue-700",
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-600",
      link: "text-emerald-600 hover:text-emerald-700",
    },
    amber: {
      bg: "bg-amber-50 text-amber-600",
      link: "text-amber-600 hover:text-amber-700",
    },
    indigo: {
      bg: "bg-indigo-50 text-indigo-600",
      link: "text-indigo-600 hover:text-indigo-700",
    },
  }[theme];

  return (
    <div className="reveal-on-scroll bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm landing-card group flex flex-col justify-between">
      <div>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 landing-card-icon shadow-sm ${themeClasses.bg}`}
        >
          <Icon className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {step} • {category}
        </span>
        <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div
        className={`mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold ${themeClasses.link}`}
      >
        <span>{footerText}</span>
      </div>
    </div>
  );
}

