"use client";

import React from "react";
import { Client, InvoiceItem, PaymentMethod } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import { PaymentMethodBadge } from "@/components/ui/StatusBadge";
import { useApp } from "@/lib/store-context";

interface InvoicePreviewPaperProps {
  invoiceNumber: string;
  client: Client | null;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalHT: number;
  taxTotal: number;
  totalTTC: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status?: "paid" | "sent" | "draft" | "overdue";
  discountPercent?: number;
  invoiceMode?: "standard" | "deposit" | "recurring";
  depositPercent?: number;
  depositAmount?: number;
  recurringFrequency?: string;
}

export function InvoicePreviewPaper({
  invoiceNumber,
  client,
  issueDate,
  dueDate,
  items,
  subtotalHT,
  taxTotal,
  totalTTC,
  paymentMethod,
  notes,
  status = "draft",
  discountPercent = 0,
  invoiceMode = "standard",
  depositPercent = 50,
  depositAmount,
  recurringFrequency = "Mensuelle",
}: InvoicePreviewPaperProps) {
  const { companySettings } = useApp();

  const discountAmount = Math.round(subtotalHT * (discountPercent / 100));
  const finalTotal = totalTTC - discountAmount;
  const calculatedDeposit =
    depositAmount !== undefined
      ? depositAmount
      : Math.round(finalTotal * (depositPercent / 100));
  const balanceRemaining = Math.max(0, finalTotal - calculatedDeposit);

  return (
    <div
      id="invoice-paper"
      className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl max-w-2xl mx-auto space-y-7 relative select-none font-sans text-slate-900 transition-all"
    >
      {/* Watermark / Paper Header badge */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-base shadow-sm">
              i
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-950 block leading-tight">
                {companySettings?.tradeName || "izi facture"}
              </span>
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider block">
                Zone UEMOA / CEMAC
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Facture certifiée aux normes fiscales UEMOA
          </p>
        </div>

        {/* Invoice Title & Number */}
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
            FACTURE
          </span>
          <span className="text-xl sm:text-2xl font-light text-slate-950 font-display tracking-tight block">
            {invoiceNumber || "FAC-XXXX-XXXX"}
          </span>

          {/* Mode Pill (Acompte / Récurrente) */}
          {invoiceMode === "deposit" && (
            <div className="mt-1 flex justify-end">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                🏷️ Facture d&apos;Acompte ({depositPercent}%)
              </span>
            </div>
          )}

          {invoiceMode === "recurring" && (
            <div className="mt-1 flex justify-end">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-900 border border-violet-300 uppercase tracking-wider">
                🔄 Facture Récurrente ({recurringFrequency})
              </span>
            </div>
          )}

          {status && status !== "draft" && (
            <div className="mt-1 flex justify-end">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  status === "paid"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : status === "sent"
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "bg-rose-50 text-rose-800 border-rose-300"
                }`}
              >
                {status === "paid"
                  ? "Payée"
                  : status === "sent"
                  ? "Envoyée"
                  : "En retard"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Parties Information (Émetteur & Client) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Émetteur / Prestataire (Uses info from Settings!) */}
        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Émetteur (Prestataire) :
          </span>
          <p className="font-bold text-slate-900 text-sm">
            {companySettings?.companyName || "Afrik Innovations SARL"}
          </p>
          <p className="text-slate-600">
            RCCM : {companySettings?.rccm || "CI-ABJ-03-2024-B12-00452"}
          </p>
          <p className="text-slate-600">
            CC / NCC : {companySettings?.ncc || "2401892 A"} · {companySettings?.city || "Abidjan"}
          </p>
          <p className="text-slate-600">
            {companySettings?.country || "Côte d'Ivoire"} · Tel : {companySettings?.phone || "+225 07 88 45 12 90"}
          </p>
          {companySettings?.email && (
            <p className="text-slate-500 text-[11px] truncate">
              {companySettings.email}
            </p>
          )}
        </div>

        {/* Client Facturé */}
        <div className="space-y-1 bg-violet-50/40 p-3.5 rounded-2xl border border-violet-100">
          <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
            Client Facturé :
          </span>
          {client ? (
            <>
              <p className="font-bold text-slate-900 text-sm">{client.companyName}</p>
              <p className="text-slate-700 font-medium">{client.name}</p>
              <p className="text-slate-600">{client.email}</p>
              <p className="text-slate-600">
                {client.phone} · {client.city}, {client.country}
              </p>
            </>
          ) : (
            <p className="text-slate-400 italic py-2">
              Sélectionnez un client dans le formulaire...
            </p>
          )}
        </div>
      </div>

      {/* Dates & Currency block */}
      <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            Date d'émission
          </span>
          <span className="font-bold text-slate-800">
            {formatDateFR(issueDate)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            Date d'échéance
          </span>
          <span className="font-bold text-slate-800">
            {formatDateFR(dueDate)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">
            Devise active
          </span>
          <span className="font-bold text-violet-700">FCFA (XOF)</span>
        </div>
      </div>

      {/* Line items table */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Prestations & Services Facturés :
        </span>
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-2 text-center w-12">Qté</th>
                <th className="py-2.5 px-3 text-right">Prix Unit. HT</th>
                <th className="py-2.5 px-2 text-center w-14">TVA</th>
                <th className="py-2.5 px-3 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {item.description || "Prestation non renseignée"}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 px-3 text-right font-display text-slate-600 whitespace-nowrap">
                    {formatFCFA(item.unitPrice)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-500 whitespace-nowrap">
                    {item.taxRate}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-display whitespace-nowrap">
                    {formatFCFA(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financials totals breakdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
        {/* Payment info left */}
        <div className="space-y-2 max-w-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Mode de règlement agréé :
            </span>
            <PaymentMethodBadge method={paymentMethod} />
          </div>

          {/* Dynamic Payment Details from Settings */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
            {paymentMethod === "wave" && (
              <p className="text-slate-700">
                <span className="font-bold text-sky-600">Wave :</span>{" "}
                <span className="font-mono font-bold text-slate-900">
                  {companySettings?.wavePhone || "+225 07 88 45 12 90"}
                </span>{" "}
                ({companySettings?.waveMerchantName || "Afrik Innovations"})
              </p>
            )}
            {paymentMethod === "orange_money" && (
              <p className="text-slate-700">
                <span className="font-bold text-orange-600">Orange Money :</span> Code Marchand{" "}
                <span className="font-mono font-bold text-slate-900">
                  #{companySettings?.omMerchantCode || "489201"}
                </span>
              </p>
            )}
            {paymentMethod === "mtn_momo" && (
              <p className="text-slate-700">
                <span className="font-bold text-amber-600">MTN MoMo :</span>{" "}
                <span className="font-mono font-bold text-slate-900">
                  {companySettings?.mtnPhone || "+229 97 12 45 88"}
                </span>
              </p>
            )}
            {paymentMethod === "bank_transfer" && (
              <div className="text-slate-700 space-y-0.5">
                <p className="font-bold text-slate-900">
                  {companySettings?.bankName || "Ecobank Côte d'Ivoire"}
                </p>
                <p className="font-mono text-[10px]">
                  IBAN : {companySettings?.bankIban || "CI059 01001 0023456789 42"}
                </p>
                {companySettings?.bankSwift && (
                  <p className="font-mono text-[10px]">
                    SWIFT / BIC : {companySettings.bankSwift}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {notes ||
              companySettings?.legalNotice ||
              "Règlement par Wave ou Virement Bancaire sous 15 jours. Mentionner la référence de facture."}
          </p>
        </div>

        {/* Calculation block right */}
        <div className="w-full sm:w-72 space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex justify-between text-slate-600">
            <span>Sous-total HT :</span>
            <span className="font-bold text-slate-900 font-display">
              {formatFCFA(subtotalHT)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Remise ({discountPercent}%) :</span>
              <span className="font-bold font-display">
                -{formatFCFA(discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>TVA standard (18%) :</span>
            <span className="font-bold text-slate-900 font-display">
              {formatFCFA(taxTotal)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-950 font-bold">
            <span className="text-xs uppercase tracking-tight">Total TTC :</span>
            <span
              className={`text-base sm:text-lg font-display ${
                invoiceMode === "deposit" ? "text-slate-900" : "text-violet-700"
              }`}
            >
              {formatFCFA(finalTotal)}
            </span>
          </div>

          {/* Deposit Mode Extra Breakdown */}
          {invoiceMode === "deposit" && (
            <>
              <div className="pt-1.5 flex justify-between items-baseline text-amber-900 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span className="text-[11px] uppercase tracking-tight">
                  Acompte ({depositPercent}%) :
                </span>
                <span className="text-base font-display text-amber-700">
                  {formatFCFA(calculatedDeposit)}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-slate-600 text-xs px-2 pt-0.5">
                <span>Solde à la livraison :</span>
                <span className="font-bold font-display text-slate-900">
                  {formatFCFA(balanceRemaining)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Signature & Stamp Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div>
          <span>Signature autorisée</span>
          <p className="text-slate-800 font-bold mt-1 font-serif italic text-xs">
            {companySettings?.companyName || "Afrik Innovations SARL"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider block">
            Cachet numérique vérifié
          </span>
          <span className="text-emerald-700 font-bold">✓ CERTIFIÉ CONFORME</span>
        </div>
      </div>
    </div>
  );
}
