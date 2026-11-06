"use client";

import React from "react";

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  meta: string;
  metaVariant?: "slate" | "emerald";
}

export function StepCard({
  step,
  title,
  description,
  meta,
  metaVariant = "slate",
}: StepCardProps) {
  const metaClasses = {
    slate: "text-slate-500 font-mono",
    emerald: "text-emerald-600 font-mono font-bold",
  }[metaVariant];

  return (
    <div className="reveal-on-scroll relative bg-slate-50 rounded-2xl p-7 sm:p-8 border border-slate-200/80 landing-card flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-display font-bold text-xl flex items-center justify-center mb-6 shadow-sm">
          {step}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className={`mt-6 text-xs ${metaClasses}`}>{meta}</div>
    </div>
  );
}

