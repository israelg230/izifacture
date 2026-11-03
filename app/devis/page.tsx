"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { QuotePreviewPaper } from "@/components/quotes/QuotePreviewPaper";
import { DatePicker } from "@/components/ui/DatePicker";
import { useApp } from "@/lib/store-context";
import { Quote, QuoteStatus, PaymentMethod, InvoiceItem, Client } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Percent,
  X,
  Send,
  Eye,
  FileCheck,
  Building2,
  Calendar,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

export default function DevisPage() {
  const router = useRouter();
  const { quotes, clients, addQuote, updateQuote, deleteQuote, convertQuoteToInvoice } = useApp();

  const [activeFilter, setActiveFilter] = useState<"all" | QuoteStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Quote Form State
  const [newClientId, setNewClientId] = useState<string>(clients[0]?.id || "");
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [newValidDays, setNewValidDays] = useState<number>(30);
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [newNotes, setNewNotes] = useState<string>(
    "Merci pour votre confiance ! Devis valable 30 jours à compter de son émission. Acompte de 50% payable à la commande, solde à la livraison et recette définitive."
  );

  const [newItems, setNewItems] = useState<InvoiceItem[]>([
    {
      id: "qi_new_1",
      description: "Configuration & automatisation des flux documentaires",
      quantity: 5,
      unitPrice: 40000,
      taxRate: 18,
      subtotal: 169492,
      taxAmount: 30508,
      total: 200000,
    },
    {
      id: "qi_new_2",
      description: "Design sur-mesure des gabarits PDF & conformité fiscale UEMOA",
      quantity: 12,
      unitPrice: 30000,
      taxRate: 18,
      subtotal: 305085,
      taxAmount: 54915,
      total: 360000,
    },
  ]);

  // Form Calculations
  const formSubtotal = newItems.reduce((sum, item) => sum + Math.round(item.quantity * item.unitPrice), 0);
  const formTax = Math.round(formSubtotal * 0.18);
  const formTotal = formSubtotal + formTax;

  // Summary Metrics
  const totalQuotesBilled = quotes.reduce((sum, q) => sum + q.total, 0);
  const pendingQuotesCount = quotes.filter((q) => q.status === "sent" || q.status === "draft").length;
  const acceptedQuotesCount = quotes.filter((q) => q.status === "accepted" || q.status === "converted").length;
  const conversionRate = quotes.length > 0 ? Math.round((acceptedQuotesCount / quotes.length) * 100) : 0;

  // Status Counts
  const counts = {
    all: quotes.length,
    sent: quotes.filter((q) => q.status === "sent").length,
    accepted: quotes.filter((q) => q.status === "accepted").length,
    converted: quotes.filter((q) => q.status === "converted").length,
    draft: quotes.filter((q) => q.status === "draft").length,
    rejected: quotes.filter((q) => q.status === "rejected").length,
  };

  // Filtered Quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      if (activeFilter !== "all" && q.status !== activeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNumber = q.number.toLowerCase().includes(query);
        const matchCompany = q.client.companyName.toLowerCase().includes(query);
        const matchClient = q.client.name.toLowerCase().includes(query);
        const matchTitle = q.projectTitle.toLowerCase().includes(query);
        return matchNumber || matchCompany || matchClient || matchTitle;
      }
      return true;
    });
  }, [quotes, activeFilter, searchQuery]);

  // Handle Form Item Change
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...newItems];
    const item = { ...updated[index], [field]: value };
    const qty = field === "quantity" ? Number(value) : item.quantity;
    const price = field === "unitPrice" ? Number(value) : item.unitPrice;
    item.total = Math.round(qty * price);
    item.subtotal = Math.round(item.total / 1.18);
    item.taxAmount = item.total - item.subtotal;
    updated[index] = item;
    setNewItems(updated);
  };

  const addItem = () => {
    setNewItems([
      ...newItems,
      {
        id: `qi_${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 50000,
        taxRate: 18,
        subtotal: 42373,
        taxAmount: 7627,
        total: 50000,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== index));
    }
  };

  // Save New Quote
  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === newClientId) || clients[0];
    if (!client) return;

    const nextNum = quotes.length + 29;
    const newQuoteNumber = `DEV-2024-00${nextNum}`;
    const validUntilDate = new Date(Date.now() + newValidDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const quoteToSave: Quote = {
      id: `quote_${Date.now()}`,
      number: newQuoteNumber,
      client,
      projectTitle: newProjectTitle.trim() || "Prestation de services professionnels",
      date: newDate,
      validUntil: validUntilDate,
      status: "sent",
      subtotal: formSubtotal,
      taxTotal: formTax,
      total: formTotal,
      paymentMethod: newPaymentMethod,
      notes: newNotes,
      items: newItems,
    };

    addQuote(quoteToSave);
    setIsCreateModalOpen(false);
    setPreviewQuote(quoteToSave);
  };

  // Convert Quote into Invoice
  const handleConvert = async (quoteId: string) => {
    const createdInvoice = await convertQuoteToInvoice(quoteId);
    if (createdInvoice) {
      router.push(`/factures/${createdInvoice.id}`);
    }
  };

  // Status Badge Component
  const renderStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Accepté
          </span>
        );
      case "converted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-800 border border-violet-300">
            <FileCheck className="w-3 h-3 text-violet-600" />
            Facturé
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Refusé
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Brouillon
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar */}
      <SidebarRail />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav activeTab="estimates" />
        <TopNav activeTab="estimates" />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Propositions Commerciales
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-500 font-medium">Zone UEMOA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                Devis & Proformas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Émettez des devis conformes aux normes UEMOA et convertissez-les en factures en un clic.
              </p>
            </div>

            {/* Nouveau Devis Button (Strict Rule GEMINI.md: black -> violet with 90deg + rotation) */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#111318] text-white text-xs font-bold transition-all duration-300 hover:bg-violet-600 active:bg-violet-700 hover:shadow-md hover:shadow-violet-500/25 active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 text-amber-300" />
              <span>Nouveau Devis</span>
            </button>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Total Chiffré */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Devis Émis
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display truncate">
                {formatFCFA(totalQuotesBilled)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {quotes.length} propositions commerciales
              </p>
            </div>

            {/* 2. En Attente de validation */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  En Attente Client
                </span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                {pendingQuotesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                À relancer ou négocier
              </p>
            </div>

            {/* 3. Acceptés & Convertis */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Devis Validés
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                {acceptedQuotesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Acceptés ou transformés en facture
              </p>
            </div>

            {/* 4. Taux de Transformation */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Taux de Succès
                </span>
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                {conversionRate}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Ratio devis convertis en ventes
              </p>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                    activeFilter === "all"
                      ? "bg-slate-950 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tous ({counts.all})
                </button>
                <button
                  onClick={() => setActiveFilter("sent")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                    activeFilter === "sent"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  En attente ({counts.sent})
                </button>
                <button
                  onClick={() => setActiveFilter("accepted")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                    activeFilter === "accepted"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  Acceptés ({counts.accepted})
                </button>
                <button
                  onClick={() => setActiveFilter("converted")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                    activeFilter === "converted"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-violet-50 text-violet-800 hover:bg-violet-100 border border-violet-200"
                  }`}
                >
                  Facturés ({counts.converted})
                </button>
                <button
                  onClick={() => setActiveFilter("draft")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                    activeFilter === "draft"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Brouillons ({counts.draft})
                </button>
              </div>

              {/* Search bar with animated magnifying glass */}
              <div className="relative group w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher devis, client, objet..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Quotes Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Numéro</th>
                    <th className="py-3 px-3">Client & Destinataire</th>
                    <th className="py-3 px-3">Prestation / Objet</th>
                    <th className="py-3 px-3">Émission</th>
                    <th className="py-3 px-3">Validité</th>
                    <th className="py-3 px-3 text-right">Montant TTC</th>
                    <th className="py-3 px-3 text-center">Statut</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredQuotes.length > 0 ? (
                    filteredQuotes.map((q) => (
                      <tr
                        key={q.id}
                        className="hover:bg-violet-50/25 transition-all duration-150 group"
                      >
                        {/* Numéro */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setPreviewQuote(q)}
                            className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-amber-300 transition-all"
                          >
                            {q.number}
                          </button>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-3 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full ${q.client.avatarColor || "bg-violet-600"} text-white flex items-center justify-center font-bold text-[11px] shrink-0`}
                            >
                              {q.client.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">
                                {q.client.companyName}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {q.client.name} · {q.client.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Prestation */}
                        <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-700 font-medium">
                          {q.projectTitle}
                        </td>

                        {/* Émission */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                          {formatDateFR(q.date)}
                        </td>

                        {/* Validité */}
                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-500">
                          {formatDateFR(q.validUntil)}
                        </td>

                        {/* Montant TTC */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap font-light text-slate-950 font-display text-sm">
                          {formatFCFA(q.total)}
                        </td>

                        {/* Statut */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {renderStatusBadge(q.status)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Voir / Aperçu */}
                            <button
                              type="button"
                              onClick={() => setPreviewQuote(q)}
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                              title="Voir le devis complet"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Convertir en Facture */}
                            {q.status !== "converted" && (
                              <button
                                type="button"
                                onClick={() => handleConvert(q.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border border-violet-200 text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                                title="Transformer ce devis en facture officielle"
                              >
                                <ArrowRight className="w-3 h-3" />
                                <span className="hidden sm:inline">Facturer</span>
                              </button>
                            )}

                            {/* Supprimer */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Supprimer définitivement le devis ${q.number} ?`)) {
                                  deleteQuote(q.id);
                                }
                              }}
                              className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all border border-rose-200/50"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Aucun devis trouvé pour ces critères de recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Aperçu Haute Fidélité du Devis (Template Linda Friday Style) */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-100 rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-4 sm:p-6 space-y-4 my-auto max-h-[95vh] overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0d1527]">
                  {previewQuote.number}
                </span>
                {renderStatusBadge(previewQuote.status)}
              </div>

              <div className="flex items-center gap-2">
                {/* Convertir en Facture Button */}
                {previewQuote.status !== "converted" && (
                  <button
                    type="button"
                    onClick={() => handleConvert(previewQuote.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Convertir en Facture</span>
                  </button>
                )}

                {/* Print Button */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimer / PDF</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewQuote(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The Document Paper Component */}
            <div className="bg-white rounded-3xl p-2 sm:p-4">
              <QuotePreviewPaper quote={previewQuote} />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nouveau Devis (Interactive Form) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-5 sm:p-7 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Créer un Devis / Proforma
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Générez une proposition financière professionnelle avec calcul automatique
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
              {/* Row 1: Client & Objet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Sélectionner le Client *
                  </label>
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors font-medium"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.name} - {c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Objet de la Mission *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Automatisation Documentaire & Intégration PDF"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Date, Validité, Mode de paiement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <DatePicker
                  label="Date d'émission"
                  value={newDate}
                  onChange={setNewDate}
                />

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Durée de validité
                  </label>
                  <select
                    value={newValidDays}
                    onChange={(e) => setNewValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900"
                  >
                    <option value={15}>15 jours</option>
                    <option value={30}>30 jours (Standard)</option>
                    <option value={60}>60 jours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mode de règlement proposé
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900"
                  >
                    <option value="bank_transfer">Virement Bancaire</option>
                    <option value="wave">Wave Mobile Money</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="mtn_momo">MTN MoMo</option>
                  </select>
                </div>
              </div>

              {/* Lignes de prestations */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Lignes de Prestations (Articles / Services)
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter une ligne
                  </button>
                </div>

                <div className="space-y-2">
                  {newItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Description de la prestation / service"
                          value={item.description}
                          onChange={(e) => updateItem(idx, "description", e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min={1}
                          required
                          placeholder="Qté"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-center text-slate-900"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          required
                          placeholder="Prix unitaire"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-right font-mono text-slate-900"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={newItems.length <= 1}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-30 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total HT :</span>
                  <span className="font-mono font-bold text-slate-900">{formatFCFA(formSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA UEMOA (18%) :</span>
                  <span className="font-mono font-bold text-slate-900">{formatFCFA(formTax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-slate-200 text-slate-950 font-display">
                  <span>Total TTC :</span>
                  <span className="text-amber-800 font-mono text-base">{formatFCFA(formTotal)}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#111318] hover:bg-violet-600 active:bg-violet-700 active:scale-95 transition-all shadow-sm"
                >
                  Générer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
