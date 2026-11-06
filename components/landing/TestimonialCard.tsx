"use client";

import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  location: string;
  initials: string;
  avatarBg?: string;
  stars?: number;
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
  location,
  initials,
  avatarBg = "bg-slate-900",
  stars = 5,
}: TestimonialCardProps) {
  return (
    <div className="reveal-on-scroll bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm landing-card flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1 text-amber-500 text-sm mb-4" aria-label={`${stars} étoiles`}>
          {"★".repeat(stars)}
        </div>
        <p className="text-slate-700 text-sm leading-relaxed italic mb-6">"{quote}"</p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div
          className={`w-11 h-11 rounded-full ${avatarBg} text-white font-bold flex items-center justify-center text-sm font-display shrink-0 shadow-sm`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-slate-900 truncate">{name}</h4>
          <p className="text-xs text-slate-500 truncate">
            {role}, {company} • {location}
          </p>
        </div>
      </div>
    </div>
  );
}

