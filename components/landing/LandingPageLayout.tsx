"use client";

import React from "react";
import { LandingHeader } from "./LandingHeader";
import { LandingHero } from "./LandingHero";
import { BrandMarquee } from "./BrandMarquee";
import { ProblemSection } from "./ProblemSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { LandingFooter } from "./LandingFooter";
import { useScrollReveal } from "./useScrollReveal";

export function LandingPageLayout() {
  // Activate graceful scroll reveal observer
  useScrollReveal();

  return (
    <div className="font-sans antialiased text-slate-900 bg-[#FBFBFD] selection:bg-slate-900 selection:text-white min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <BrandMarquee />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

