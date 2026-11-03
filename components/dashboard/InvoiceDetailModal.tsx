"use client";

import React from "react";
import {
  X,
  Download,
  Share2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Invoice } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import { StatusBadge, PaymentMethodBadge } from "@/components/ui/StatusBadge";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onMarkAsPaid: (invoiceId: string) => void;
}

export function InvoiceDetailModal({
  invoice,
  onClose,
  onMarkAsPaid,
}: InvoiceDetailModalProps) {
  if (!invoice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Détails de la facture ${invoice.number}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 animate-in fade-in duration-150"
    >
      <div
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[28px] border border-slate-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
              {invoice.number}
            </span>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Téléchargement du PDF officiel ${invoice.number}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => {
                const text = `Bonjour, voici votre facture ${invoice.number} de ${formatFCFA(invoice.total)} : https://izifacture.com/f/${invoice.id}`;
                navigator.clipboard?.writeText(text);
                alert("Lien de partage copié !");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Partager</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors ml-1"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Dual Columns Flat */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Client Profile & Payment Details */}
            <div className="lg:col-span-5 space-y-5">
              {/* Client Profile Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Profil Client
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Client vérifié
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${invoice.client.avatarColor} text-white flex items-center justify-center font-bold text-base shrink-0`}
                  >
                    {invoice.client.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {invoice.client.companyName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      {invoice.client.name}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{invoice.client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{invoice.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {invoice.client.city}, {invoice.client.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Mode de règlement
                </span>
                <div className="flex items-center justify-between">
                  <PaymentMethodBadge method={invoice.paymentMethod} />
                  <span className="text-xs font-bold text-slate-700">
                    Compte certifié
                  </span>
                </div>
              </div>

              {/* Notes Card */}
              {invoice.notes && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Notes & Instructions
                  </span>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    « {invoice.notes} »
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Invoice Details & Items */}
            <div className="lg:col-span-7 space-y-5">
              {/* Summary Banner */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">
                      Titre du projet / prestation
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {invoice.projectTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Émise le {formatDateFR(invoice.issueDate)}
                      </span>
                      <span className="font-bold text-slate-800">
                        Échéance : {formatDateFR(invoice.dueDate)}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-5">
                    <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">
                      Total TTC
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
                      {formatFCFA(invoice.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Détail des prestations
                </h4>

                <div className="divide-y divide-slate-100">
                  {invoice.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">
                          {item.description}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Qté : {item.quantity} × {formatFCFA(item.unitPrice)} · TVA {item.taxRate}%
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 whitespace-nowrap">
                          {formatFCFA(item.total)}
                        </span>
                        <p className="text-[10px] text-slate-400 whitespace-nowrap">
                          TVA: {formatFCFA(item.taxAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal, TVA, and Total */}
                <div className="mt-5 pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total HT</span>
                    <span className="font-bold text-slate-800">
                      {formatFCFA(invoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (18% zone UEMOA/CEMAC)</span>
                    <span className="font-bold text-slate-800">
                      {formatFCFA(invoice.taxTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Net à Payer</span>
                    <span className="text-base text-violet-700">
                      {formatFCFA(invoice.total)}
                    </span>
                  </div>

                  {invoice.amountPaid > 0 && (
                    <div className="flex justify-between text-xs text-emerald-700 font-bold pt-1">
                      <span>Montant déjà réglé</span>
                      <span>- {formatFCFA(invoice.amountPaid)}</span>
                    </div>
                  )}

                  {invoice.balanceDue > 0 && (
                    <div className="flex justify-between text-xs font-bold text-rose-700 pt-1">
                      <span>Solde restant à régler</span>
                      <span>{formatFCFA(invoice.balanceDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                {invoice.status !== "paid" && (
                  <button
                    onClick={() => {
                      onMarkAsPaid(invoice.id);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Encaisser & Marquer Payée</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
