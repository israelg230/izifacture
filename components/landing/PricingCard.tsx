"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { HeroPrimaryButton } from "./HeroPrimaryButton";

interface PricingCardProps {
  name: string;
  badge: string;
  description: string;
  price: string;
  period?: string;
  features: (string | { text: string; strong?: string })[];
  isFeatured?: boolean;
  ctaText: string;
  ctaHref?: string;
}

export function PricingCard({
  name,
  badge,
  description,
  price,
  period = "FCFA / mois",
  features,
  isFeatured = false,
  ctaText,
  ctaHref = "/connexion?mode=register",
}: PricingCardProps) {
  if (isFeatured) {
    return (
      <div className="reveal-on-scroll relative dark-showcase-card rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col justify-between transform lg:-translate-y-4">
        {/* Featured Badge with Shimmer animation */}
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <span className="badge-shimmer px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md border border-blue-400">
            Recommandé • Le plus populaire
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="text-2xl font-bold font-display text-white">{name}</h3>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              {badge}
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-6">{description}</p>

          <div className="mb-8 pb-8 border-b border-slate-700/80">
            <span className="font-display text-4xl sm:text-5xl font-bold text-white">{price}</span>
            <span className="text-sm font-semibold text-slate-400 ml-2">{period}</span>
          </div>

          <ul className="space-y-4 text-sm text-slate-200">
            {features.map((feat, idx) => {
              const label = typeof feat === "string" ? feat : feat.text;
              const strong = typeof feat === "object" ? feat.strong : undefined;
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span>
                    {strong && <strong>{strong} </strong>}
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 pt-2">
          <HeroPrimaryButton
            href={ctaHref}
            variant="light"
            size="lg"
            className="w-full text-center"
            showArrow={false}
          >
            {ctaText}
          </HeroPrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="reveal-on-scroll bg-[#FBFBFD] rounded-3xl p-8 sm:p-10 border border-slate-200 flex flex-col justify-between landing-card">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          <span className="px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-semibold">
            {badge}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-6">{description}</p>

        <div className="mb-8 pb-8 border-b border-slate-200">
          <span className="font-display text-4xl sm:text-5xl font-bold text-slate-900">{price}</span>
          <span className="text-sm font-semibold text-slate-500 ml-2">{period}</span>
        </div>

        <ul className="space-y-4 text-sm text-slate-700">
          {features.map((feat, idx) => {
            const label = typeof feat === "string" ? feat : feat.text;
            const strong = typeof feat === "object" ? feat.strong : undefined;
            return (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
                <span>
                  {strong && <strong>{strong} </strong>}
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        <Link
          href={ctaHref}
          className="magnetic-btn w-full block text-center py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors shadow-sm"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

