"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/connexion" || pathname === "/login";
  const isPublicPage = isAuthPage || pathname === "/" || pathname === "/landing";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicPage) {
        router.push("/connexion");
      } else if (isAuthenticated && isAuthPage) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, isPublicPage, isAuthPage, router]);

  // Loading state with smooth transition (only for protected pages or auth)
  if (isLoading && !isPublicPage) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-violet-500/20 animate-pulse">
            i
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
            <span>Chargement d'izi facture...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated on protected route -> prevent render until redirect triggers
  if (!isAuthenticated && !isPublicPage) {
    return null;
  }

  return <>{children}</>;
}
