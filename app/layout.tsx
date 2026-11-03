import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "izi facture — Facturation SaaS pour entrepreneurs d'Afrique",
  description:
    "Générez, suivez et encaissez vos factures professionnelles en FCFA. Compatible Mobile Money (Wave, MTN, Orange, Moov) et virement bancaire.",
};

import { AppProvider } from "@/lib/store-context";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-[#faf9f6] text-ink-900 selection:bg-lavender-200 selection:text-lavender-900">
        <AuthProvider>
          <AuthGuard>
            <AppProvider>{children}</AppProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
