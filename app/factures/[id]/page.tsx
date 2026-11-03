"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { InvoicePreviewPaper } from "@/components/invoices/InvoicePreviewPaper";
import { StatusBadge, PaymentMethodBadge } from "@/components/ui/StatusBadge";
import { useApp } from "@/lib/store-context";
import { InvoiceStatus, PaymentMethod } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Share2,
  ChevronDown,
  X,
  FileText,
  DollarSign,
  CreditCard,
  Download,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id as string;

  const { invoices, updateInvoiceStatus, deleteInvoice } = useApp();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Retrieve invoice
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  // If invoice not found
  if (!invoice) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <SidebarRail />
        <div className="flex-1 flex flex-col min-w-0">
          <MobileNav activeTab="invoices" />
          <TopNav activeTab="invoices" />

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-md shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Facture introuvable
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                La facture demandée n&apos;existe pas ou a été supprimée de votre espace.
              </p>
              <div className="mt-6">
                <Link
                  href="/factures"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux factures
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setIsStatusDropdownOpen(false);
    setIsUpdatingStatus(true);
    const res = await updateInvoiceStatus(invoice.id, newStatus);
    setIsUpdatingStatus(false);
    if (!res.success) {
      alert(`Erreur de mise à jour du statut dans la base de données : ${res.error}`);
    }
  };

  const confirmDelete = async () => {
    const res = await deleteInvoice(invoice.id);
    setIsDeleteModalOpen(false);
    if (res.success) {
      router.push("/factures");
    } else {
      alert(`Erreur de suppression dans la base de données : ${res.error}`);
    }
  };

  // WhatsApp share link
  const clientPhoneClean = invoice.client.phone.replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(
    `Bonjour ${invoice.client.companyName},\n\nVoici le récapitulatif de votre facture izi facture N° ${invoice.number} d'un montant de ${formatFCFA(invoice.total)}.\nÉchéance : ${formatDateFR(invoice.dueDate)}.\n\nMode de paiement : ${invoice.paymentMethod.toUpperCase()}.\nMerci pour votre confiance !`
  );
  const whatsappUrl = `https://wa.me/${clientPhoneClean}?text=${whatsappText}`;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Left Rail Navigation (Hidden on print) */}
      <div className="print:hidden">
        <SidebarRail />
      </div>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <MobileNav activeTab="invoices" />
          <TopNav activeTab="invoices" />
        </div>

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
          {/* Top Bar Actions (Hidden on print) */}
          <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
            {/* Breadcrumb & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/factures"
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-violet-100 hover:text-violet-700 active:scale-95 text-slate-600 flex items-center justify-center transition-all duration-200"
                title="Retour à la liste"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-slate-500">
                    {invoice.number}
                  </span>
                  <StatusBadge status={invoice.status} />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-950 font-display">
                  {invoice.client.companyName}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Changer Statut Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-slate-200"
                >
                  <span>Changer Statut</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-40 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange("paid")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        invoice.status === "paid"
                          ? "bg-emerald-50 text-emerald-800"
                          : "hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-800"
                      }`}
                    >
                      <span>Marquer Payée</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("sent")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        invoice.status === "sent"
                          ? "bg-amber-50 text-amber-800"
                          : "hover:bg-amber-50/60 text-slate-700 hover:text-amber-800"
                      }`}
                    >
                      <span>Marquer Envoyée</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("overdue")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        invoice.status === "overdue"
                          ? "bg-rose-50 text-rose-800"
                          : "hover:bg-rose-50/60 text-slate-700 hover:text-rose-800"
                      }`}
                    >
                      <span>Marquer En retard</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange("draft")}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        invoice.status === "draft"
                          ? "bg-slate-100 text-slate-800"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>Remettre Brouillon</span>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Modifier (Pre-filled form) */}
              <Link
                href={`/factures/nouvelle?edit=${invoice.id}`}
                className="group inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600 group-hover:scale-110 transition-transform" />
                <span>Modifier</span>
              </Link>

              {/* Imprimer / PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-slate-200"
                title="Imprimer ou enregistrer en PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Imprimer / PDF</span>
              </button>

              {/* WhatsApp Share */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 active:scale-95 text-xs font-bold rounded-2xl transition-all"
                title="Partager le récapitulatif par WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Supprimer (Danger) */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 text-xs font-bold rounded-2xl transition-all"
                title="Supprimer la facture"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">Supprimer</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid: Left Document (8 cols) & Right Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: The Invoice Paper Document */}
            <div className="lg:col-span-8 space-y-6">
              {/* Paper Invoice */}
              <InvoicePreviewPaper
                invoiceNumber={invoice.number}
                client={invoice.client}
                issueDate={invoice.issueDate}
                dueDate={invoice.dueDate}
                items={invoice.items}
                subtotalHT={invoice.subtotal}
                taxTotal={invoice.taxTotal}
                totalTTC={invoice.total}
                paymentMethod={invoice.paymentMethod}
                notes={invoice.notes}
                status={invoice.status}
                invoiceMode={invoice.isDepositInvoice ? "deposit" : invoice.isRecurring ? "recurring" : "standard"}
                depositPercent={invoice.depositPercent}
                depositAmount={invoice.depositAmount}
                recurringFrequency={
                  invoice.recurringFrequency === "monthly"
                    ? "Mensuelle"
                    : invoice.recurringFrequency === "quarterly"
                    ? "Trimestrielle"
                    : invoice.recurringFrequency === "biannual"
                    ? "Semestrielle"
                    : "Annuelle"
                }
              />
            </div>

            {/* Right Column: Details & Management Sidebar (Hidden on print) */}
            <div className="print:hidden lg:col-span-4 space-y-5">
              {/* Financial Overview Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bilan Financier
                  </h3>
                  <PaymentMethodBadge method={invoice.paymentMethod} />
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Total TTC à payer</span>
                    <span className="text-2xl font-light text-slate-950 font-display block tracking-tight">
                      {formatFCFA(invoice.total)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Montant Réglé
                      </span>
                      <span className="text-sm font-bold text-emerald-950 font-display block mt-0.5">
                        {formatFCFA(invoice.amountPaid)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Solde Dû
                      </span>
                      <span className={`text-sm font-bold font-display block mt-0.5 ${invoice.balanceDue > 0 ? "text-rose-600" : "text-slate-900"}`}>
                        {formatFCFA(invoice.balanceDue)}
                      </span>
                    </div>
                  </div>

                  {/* Payment status badge banner */}
                  <div className="pt-2">
                    {invoice.status === "paid" ? (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Facture intégralement soldée</span>
                      </div>
                    ) : invoice.status === "overdue" ? (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Échéance dépassée — Relance recommandée</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>En attente de paiement avant le {formatDateFR(invoice.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Information Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Fiche Client
                  </h3>
                  <Link
                    href="/clients"
                    className="text-xs font-bold text-violet-600 hover:text-violet-800"
                  >
                    Voir clients
                  </Link>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${invoice.client.avatarColor || "bg-violet-600"} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
                  >
                    {invoice.client.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {invoice.client.companyName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Contact : {invoice.client.name}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      {invoice.client.city}, {invoice.client.country}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{invoice.client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{invoice.client.email}</span>
                  </div>
                  {invoice.client.address && (
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{invoice.client.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar & Deadlines Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                  Dates Clés
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date d&apos;émission :</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatDateFR(invoice.issueDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date d&apos;échéance :</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatDateFR(invoice.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                  Actions Rapides
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("paid")}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Encaisser / Marquer Payée</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-slate-200"
                  >
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>Envoyer Rappel WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Supprimer la facture {invoice.number} ?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement cette facture adressée à{" "}
                <strong className="text-slate-800">{invoice.client.companyName}</strong> d&apos;un montant de{" "}
                <strong className="text-slate-800">{formatFCFA(invoice.total)}</strong> ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-sm"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
