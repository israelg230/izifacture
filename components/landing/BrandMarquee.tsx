"use client";

import React from "react";

const brands = [
  "DAKAR•DIGITAL",
  "ABIDJAN•CONSULTING",
  "SAHEL•LOGISTICS",
  "KMER•STUDIO",
  "LOMÉ•TRADE",
];

export function BrandMarquee() {
  return (
    <section className="py-10 border-y border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <p className="text-center text-xs uppercase font-bold tracking-widest text-slate-400 mb-8">
          Adopté par plus de 2 500 consultants, agences et commerçants à travers la région
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {brands.map((brand, idx) => (
            <span
              key={idx}
              className="font-display font-bold text-base sm:text-lg text-slate-700 tracking-wider hover:text-blue-600 transition-colors select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

