"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import DashboardPage from "@/app/dashboard/page";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, show the dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // Public visitors see the modern landing page
  return <LandingPageLayout />;
}
