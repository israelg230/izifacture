"use client";

import React from "react";
import { Quote } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import { useApp } from "@/lib/store-context";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface QuotePreviewPaperProps {
  quote: Quote;
  showSignature?: boolean;
}

export function QuotePreviewPaper({
  quote,
  showSignature = true,
}: QuotePreviewPaperProps) {
  const { companySettings } = useApp();

  return (
    <div
      id="quote-printable-document"
      className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl max-w-3xl mx-auto space-y-7 relative select-none font-sans text-slate-900 transition-all overflow-hidden"
    >
      {/* Top Geometric Navy & Gold Header Decoration (Inspired by uploaded template) */}
      <div className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-r from-[#0d1527] via-[#1a2b4c] to-[#d4af37]" />
      <div className="absolute top-3.5 left-0 w-28 h-1 bg-[#d4af37]" />

      {/* Header Row: Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pt-2 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0d1527] tracking-tight font-display">
              DEVIS
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              PROFORMA
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#b8860b] tracking-widest uppercase">
            MERCI POUR VOTRE CONFIANCE !
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Proposition commerciale et financière certifiée aux normes fiscales UEMOA.
          </p>
        </div>

        {/* Company Identity & Quote Meta */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0d1527] flex items-center justify-center text-amber-400 font-black text-lg shadow-sm border border-amber-400/40">
              LF
            </div>
            <div className="text-right">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0d1527] block leading-tight">
                LINDA FRIDAY
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                DIGITAL SOLUTIONS
              </span>
            </div>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-right space-y-1 mt-1">
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Date :</span>
              <span className="font-bold text-slate-900">{formatDateFR(quote.date)}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px]">N° Devis :</span>
              <span className="font-mono font-bold text-[#0d1527]">{quote.number}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parties Information: FACTURÉ À (Client) & ÉMETTEUR (From) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* BILLED TO */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] block mb-2">
            PROPOSITION ADRESSÉE À (BILLED TO) :
          </span>
          <h4 className="font-bold text-slate-950 text-sm mb-1">
            {quote.client.companyName}
          </h4>
          <p className="text-slate-600 font-medium">À l&apos;attention de : {quote.client.name}</p>
          <p className="text-slate-500 mt-1">
            {quote.client.address || "Plateau, Boulevard de la République"}
          </p>
          <p className="text-slate-500">
            {quote.client.city}, {quote.client.country}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-0.5 text-[11px] text-slate-600">
            <p className="font-mono">{quote.client.phone}</p>
            <p>{quote.client.email}</p>
          </div>
        </div>

        {/* FROM (Prestataire from Settings) */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d1527] block mb-2">
            PRESTATAIRE (FROM) :
          </span>
          <h4 className="font-bold text-slate-950 text-sm mb-1">
            {companySettings?.companyName || "Afrik Innovations SARL"}
          </h4>
          <p className="text-slate-600 font-medium">
            {companySettings?.tradeName || "izi facture"} · {companySettings?.city || "Abidjan"}
          </p>
          <p className="text-slate-500 mt-1">
            {companySettings?.address || "Plateau, Immeuble Horizon"}
          </p>
          <p className="text-slate-500">
            {companySettings?.country || "Côte d'Ivoire"} (Zone UEMOA)
          </p>
          <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-0.5 text-[11px] text-slate-600">
            <p className="font-mono">{companySettings?.phone || "+225 07 88 45 12 90"}</p>
            <p>
              {companySettings?.email || "contact@afrikinnovations.ci"} · RCCM : {companySettings?.rccm || "CI-ABJ-03-2024-B12-00452"}
            </p>
          </div>
        </div>
      </div>

      {/* Project Title Badge */}
      <div className="bg-[#0d1527]/5 border border-[#0d1527]/10 px-4 py-2.5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Objet de la prestation :
          </span>
          <span className="text-xs font-bold text-slate-900">{quote.projectTitle}</span>
        </div>
        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
          Validité : {formatDateFR(quote.validUntil)}
        </span>
      </div>

      {/* Itemized Table (Exact Navy header from user screenshot) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0d1527] text-white text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 text-amber-400">DESCRIPTION</th>
              <th className="py-3 px-4 text-right text-amber-400">TARIF / P.U</th>
              <th className="py-3 px-4 text-center text-amber-400">QTÉ / HEURES</th>
              <th className="py-3 px-4 text-right text-amber-400">MONTANT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {quote.items.map((item, idx) => (
              <tr
                key={item.id || idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="py-3 px-4 font-medium text-slate-900">
                  {item.description}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-700">
                  {formatFCFA(item.unitPrice)}
                </td>
                <td className="py-3 px-4 text-center font-bold">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right font-bold font-mono text-slate-950">
                  {formatFCFA(Math.round(item.quantity * item.unitPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lower Section: Notes on Left & Financial Totals on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
        {/* Notes (Left - 6 cols) */}
        <div className="sm:col-span-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[#b8860b] font-bold text-[11px] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>CONDITIONS & MODALITÉS (NOTES) :</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {quote.notes ||
              "Merci pour votre confiance ! Devis valable 30 jours à compter de son émission. Acompte de 50% payable à la commande, solde à la recette définitive des livrables."}
          </p>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
            Tout retard de règlement entraînera des pénalités conformément à la législation commerciale UEMOA.
          </p>
        </div>

        {/* Totals Table (Right - 6 cols, matching template) */}
        <div className="sm:col-span-6 space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 px-3 border-b border-slate-100">
            <span className="font-bold text-slate-500 uppercase text-[11px]">SOUS-TOTAL HT</span>
            <span className="font-bold font-mono text-slate-900">
              {formatFCFA(quote.subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-3 border-b border-slate-100">
            <span className="font-bold text-slate-500 uppercase text-[11px]">TVA UEMOA (18%)</span>
            <span className="font-bold font-mono text-slate-900">
              {formatFCFA(quote.taxTotal)}
            </span>
          </div>

          {/* TOTAL TTC Navy Bar with Gold font */}
          <div className="flex justify-between items-center py-2.5 px-4 bg-[#0d1527] text-white rounded-2xl shadow-sm">
            <span className="font-extrabold uppercase tracking-wider text-xs text-amber-400">
              TOTAL TTC :
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-400 tracking-tight">
              {formatFCFA(quote.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Information & Payment Methods Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Payment Information */}
        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            COORDONNÉES BANCAIRES (PAYMENT INFO) :
          </span>
          <div className="space-y-1 text-[11px] text-slate-700">
            <p>
              <strong className="text-slate-900">Banque :</strong> Ecobank Côte d&apos;Ivoire
            </p>
            <p>
              <strong className="text-slate-900">Titulaire :</strong> Linda Friday Digital SARL
            </p>
            <p className="font-mono">
              <strong className="text-slate-900">RIB / IBAN :</strong> CI059 01001 0023456789 42
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            MODES DE RÈGLEMENT ACCEPTÉS (PAYMENT METHODS) :
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-300 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Wave (+225 07 88 45 12 90)
            </span>
            <span className="px-2 py-1 rounded-xl bg-orange-50 text-orange-800 border border-orange-300 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Orange Money
            </span>
            <span className="px-2 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> MTN MoMo / Moov
            </span>
            <span className="px-2 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-300 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Virement Bancaire
            </span>
          </div>
        </div>
      </div>

      {/* Template Footer: Thank you & Gold Accents */}
      <div className="pt-4 border-t border-slate-200 flex flex-col items-center text-center space-y-1 relative">
        <span className="text-2xl sm:text-3xl font-serif italic text-[#b8860b]">
          Merci pour votre confiance !
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d1527]">
          NOUS APPRÉCIONS VOTRE COLLABORATION · ZONE UEMOA
        </span>

        {/* Bottom geometric accent */}
        <div className="w-24 h-1 bg-gradient-to-r from-[#0d1527] to-[#d4af37] rounded-full mt-2" />
      </div>
    </div>
  );
}
