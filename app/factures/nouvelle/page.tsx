"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { InvoicePreviewPaper } from "@/components/invoices/InvoicePreviewPaper";
import { DatePicker } from "@/components/ui/DatePicker";
import { useApp } from "@/lib/store-context";
import { Client, Invoice, InvoiceItem, PaymentMethod } from "@/lib/types";
import { formatFCFA } from "@/lib/money";
import {
  Plus,
  Trash2,
  Send,
  Save,
  Printer,
  Download,
  ChevronLeft,
  Building2,
  Calendar,
  Hash,
  Coins,
  FileText,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  Repeat,
  BadgePercent,
  Check,
} from "lucide-react";

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(editId || null);

  const { invoices, clients, addInvoice, updateInvoice, addClient, showToast } = useApp();

  // Mode tab
  const [invoiceMode, setInvoiceMode] = useState<"standard" | "deposit" | "recurring">("standard");
  const [showPreviewMobile, setShowPreviewMobile] = useState(true);

  // Deposit Mode State
  const [depositPercent, setDepositPercent] = useState<number>(50);
  const [depositType, setDepositType] = useState<"percentage" | "fixed">("percentage");
  const [fixedDepositAmount, setFixedDepositAmount] = useState<number>(500000);

  // Recurring Mode State
  const [recurringFrequency, setRecurringFrequency] = useState<
    "Mensuelle" | "Trimestrielle" | "Semestrielle" | "Annuelle"
  >("Mensuelle");
  const [recurringDuration, setRecurringDuration] = useState<string>(
    "Indéterminée (Tacite reconduction)"
  );
  const [autoWhatsappReminder, setAutoWhatsappReminder] = useState<boolean>(true);

  // Quick Client creation modal state
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientCity, setNewClientCity] = useState("Abidjan");

  // Form Fields
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients[0]?.id || ""
  );
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => {
    const nextNum = invoices.length + 43;
    return `FAC-2024-00${nextNum}`;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const in14DaysStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [issueDate, setIssueDate] = useState<string>(todayStr);
  const [dueDate, setDueDate] = useState<string>(in14DaysStr);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wave");
  const [notes, setNotes] = useState<string>(
    "Acompte de 50% payable à la commande via Wave (+225 07 88 45 12 90) ou Virement Bancaire. Solde à livraison."
  );
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Line items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "item_init_1",
      description: "Développement application web & intégration Mobile Money",
      quantity: 1,
      unitPrice: 1250000,
      taxRate: 18,
      subtotal: 1059322,
      taxAmount: 190678,
      total: 1250000,
    },
    {
      id: "item_init_2",
      description: "Hébergement Cloud sécurisé & maintenance trimestrielle",
      quantity: 1,
      unitPrice: 350000,
      taxRate: 18,
      subtotal: 296610,
      taxAmount: 53390,
      total: 350000,
    },
  ]);

  // Load existing invoice if edit mode or client if clientParam
  const clientParam = searchParams.get("client");

  useEffect(() => {
    if (clientParam) {
      const match = clients.find((c) => c.id === clientParam);
      if (match) setSelectedClientId(match.id);
    }
  }, [clientParam, clients]);

  useEffect(() => {
    if (editId) {
      setCurrentInvoiceId(editId);
      const existing = invoices.find((i) => i.id === editId);
      if (existing) {
        setSelectedClientId(existing.client.id);
        setInvoiceNumber(existing.number);
        setIssueDate(existing.issueDate);
        setDueDate(existing.dueDate);
        setProjectTitle(existing.projectTitle);
        setPaymentMethod(existing.paymentMethod);
        if (existing.notes) setNotes(existing.notes);
        if (existing.items && existing.items.length > 0) {
          setItems(existing.items);
        }
      }
    }
  }, [editId, invoices]);

  // Calculations
  const subtotalHT = items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPrice),
    0
  );
  const taxTotal = Math.round(subtotalHT * 0.18);
  const discountAmount = Math.round(subtotalHT * (discountPercent / 100));
  const totalTTC = subtotalHT + taxTotal - discountAmount;

  // Deposit calculations
  const calculatedDepositAmount =
    depositType === "percentage"
      ? Math.round(totalTTC * (depositPercent / 100))
      : Math.min(totalTTC, fixedDepositAmount);
  const calculatedBalanceDue = Math.max(0, totalTTC - calculatedDepositAmount);

  const handleModeChange = (mode: "standard" | "deposit" | "recurring") => {
    setInvoiceMode(mode);
    if (mode === "deposit") {
      setNotes(
        `Facture d'acompte de ${depositPercent}% (${formatFCFA(
          calculatedDepositAmount
        )}) exigible à la commande. Solde restant de ${formatFCFA(
          calculatedBalanceDue
        )} payable à la livraison.`
      );
    } else if (mode === "recurring") {
      setNotes(
        `Abonnement à facturation récurrente ${recurringFrequency.toLowerCase()}. Règlement à terme échu sous 14 jours.`
      );
    } else {
      setNotes(
        "Règlement par Wave ou Virement Bancaire sous 15 jours. Mentionner la référence de facture."
      );
    }
  };

  const currentClient =
    clients.find((c) => c.id === selectedClientId) || clients[0] || null;

  // Item handlers
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 100000,
      taxRate: 18,
      subtotal: 84746,
      taxAmount: 15254,
      total: 100000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        const qty = Number(updated.quantity) || 0;
        const price = Number(updated.unitPrice) || 0;
        const lineTotal = Math.round(qty * price);

        updated.subtotal = Math.round(lineTotal / 1.18);
        updated.taxAmount = lineTotal - updated.subtotal;
        updated.total = lineTotal;

        return updated;
      })
    );
  };

  // Submit handler
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveInvoice = async (status: "draft" | "sent", redirectAfter: boolean = true) => {
    if (!currentClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    setIsSubmitting(true);
    showToast("Enregistrement et vérification dans la base de données Supabase...");

    // Determine target ID: reuse currentInvoiceId, editId, or create one for this session
    const targetId = currentInvoiceId || editId || `inv_${Date.now()}`;
    if (!currentInvoiceId) {
      setCurrentInvoiceId(targetId);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("edit", targetId);
        window.history.replaceState({}, "", url.toString());
      }
    }

    const payload: Invoice = {
      id: targetId,
      number: invoiceNumber,
      client: currentClient,
      projectTitle:
        projectTitle.trim() ||
        (items[0]?.description ? items[0].description : "Prestation de services"),
      issueDate,
      dueDate,
      status,
      subtotal: subtotalHT,
      taxTotal,
      total: totalTTC,
      amountPaid: invoiceMode === "deposit" ? calculatedDepositAmount : 0,
      balanceDue: invoiceMode === "deposit" ? calculatedBalanceDue : totalTTC,
      paymentMethod,
      priority: "Haute",
      notes,
      items,
      isDepositInvoice: invoiceMode === "deposit",
      depositPercent: invoiceMode === "deposit" ? depositPercent : undefined,
      depositAmount: invoiceMode === "deposit" ? calculatedDepositAmount : undefined,
      isRecurring: invoiceMode === "recurring",
      recurringFrequency:
        invoiceMode === "recurring"
          ? recurringFrequency === "Mensuelle"
            ? "monthly"
            : recurringFrequency === "Trimestrielle"
              ? "quarterly"
              : recurringFrequency === "Semestrielle"
                ? "biannual"
                : "yearly"
          : undefined,
    };

    const invoiceExists =
      Boolean(currentInvoiceId) ||
      Boolean(editId) ||
      invoices.some((i) => i.id === targetId || i.number === invoiceNumber);

    let res: { success: boolean; error?: string };
    if (invoiceExists) {
      res = await updateInvoice(payload);
    } else {
      res = await addInvoice(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      const statusLabel = status === "draft" ? "Brouillon" : "Envoyée";
      showToast(`✓ Facture ${invoiceNumber} (${statusLabel}) vérifiée et enregistrée en base de données !`);
      if (redirectAfter) {
        router.push("/factures");
      }
    } else {
      alert(`Erreur d'enregistrement dans Supabase : ${res.error}`);
    }
  };

  // Download Invoice Handler
  const handleDownloadInvoice = () => {
    if (!currentClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    handleSaveInvoice("sent", false);
    showToast("Facture enregistrée en base de données ! Lancement du téléchargement PDF...");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Quick client add
  const handleCreateQuickClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientCompany) return;

    const initials = newClientCompany
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: Client = {
      id: `cli_${Date.now()}`,
      name: newClientName,
      companyName: newClientCompany,
      email: newClientEmail || "contact@" + newClientCompany.toLowerCase().replace(/\s+/g, "") + ".com",
      phone: newClientPhone || "+225 07 00 00 00 00",
      city: newClientCity,
      country: "Côte d'Ivoire",
      avatarColor: "bg-violet-600",
      initials: initials || "CL",
    };

    showToast("Enregistrement du client en base de données...");
    const res = await addClient(created);
    if (res.success) {
      setSelectedClientId(created.id);
      setIsQuickClientOpen(false);
      setNewClientName("");
      setNewClientCompany("");
      showToast(`✓ Client ${created.companyName} enregistré en base de données !`);
    } else {
      alert(`Erreur création client dans Supabase : ${res.error}`);
    }
  };

  return (
  <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
    {/* 1. Desktop Left Sidebar */}
    <SidebarRail />

    {/* 2. Main Content Area */}
    <div className="flex-1 flex flex-col min-w-0">
      <MobileNav activeTab="invoices" />
      <TopNav activeTab="invoices" />

      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1700px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
        {/* Header row: Breadcrumb + Title + Preview toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <Link
                href="/factures"
                className="flex items-center gap-1 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Factures</span>
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">
                {currentInvoiceId || editId ? "Modifier la facture" : "Créer une facture"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-950 font-display tracking-tight flex items-center gap-3">
              {currentInvoiceId || editId ? "Modifier la Facture" : "Créer une Facture"}
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {invoiceNumber}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Remplissez les détails à gauche ; l'aperçu officiel en FCFA se met à jour en direct à droite.
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Show/Hide preview on small/tablet */}
            <button
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="xl:hidden flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {showPreviewMobile ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span>Masquer l'aperçu</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-violet-600" />
                  <span>Afficher l'aperçu</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              title="Imprimer / Exporter en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveInvoice("draft")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all active:scale-95"
              title="Enregistrer comme brouillon ou mettre à jour"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{currentInvoiceId || editId ? "Enregistrer les modifications" : "Enregistrer (Brouillon)"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="group flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200"
              title="Enregistrer la facture et lancer le téléchargement PDF"
            >
              <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
              <span>Télécharger la facture</span>
            </button>
          </div>
        </div>

        {/* Dual Column Split View (Form on Left, Paper Preview on Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: The Interactive Form (7 cols) */}
          <div className="xl:col-span-7 space-y-6">
            {/* Type Switcher Pills (Standard / Acompte / Récurrent) */}
            <div className="p-1 bg-white rounded-2xl border border-slate-200 flex items-center gap-1 w-full max-w-md shadow-sm">
              <button
                type="button"
                onClick={() => handleModeChange("standard")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${invoiceMode === "standard"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("deposit")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${invoiceMode === "deposit"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Acompte (Solde)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("recurring")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${invoiceMode === "recurring"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                Récurrente
              </button>
            </div>

            {/* CARD: Acompte (Solde) Configuration when mode is deposit */}
            {invoiceMode === "deposit" && (
              <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      %
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                        Modalités d&apos;Acompte & Règlement Échelonné
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Fixez le pourcentage d&apos;acompte exigible à la commande
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                    Zone UEMOA
                  </span>
                </div>

                {/* Quick Percentages Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Pourcentage d&apos;acompte exigible :
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[30, 40, 50, 70].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setDepositPercent(pct);
                          setDepositType("percentage");
                          setNotes(
                            `Facture d'acompte de ${pct}% (${formatFCFA(
                              Math.round(totalTTC * (pct / 100))
                            )}) exigible à la commande. Solde restant de ${formatFCFA(
                              totalTTC - Math.round(totalTTC * (pct / 100))
                            )} payable à la livraison.`
                          );
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${depositPercent === pct && depositType === "percentage"
                            ? "bg-[#111318] text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
                          }`}
                      >
                        {pct}%
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setDepositType("fixed")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${depositType === "fixed"
                          ? "bg-[#111318] text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
                        }`}
                    >
                      Montant fixe FCFA
                    </button>
                  </div>
                </div>

                {/* Custom input if fixed */}
                {depositType === "fixed" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Montant fixe de l&apos;acompte (FCFA) :
                    </label>
                    <input
                      type="number"
                      value={fixedDepositAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFixedDepositAmount(val);
                        setNotes(
                          `Facture d'acompte de ${formatFCFA(
                            val
                          )} exigible à la commande. Solde restant de ${formatFCFA(
                            Math.max(0, totalTTC - val)
                          )} payable à la livraison.`
                        );
                      }}
                      placeholder="Ex: 500000"
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                )}

                {/* Live Deposit Summary Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      Acompte Exigible Immédiatement :
                    </span>
                    <span className="text-lg font-light font-display text-slate-950 block mt-0.5">
                      {formatFCFA(calculatedDepositAmount)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Payable à la commande ({depositType === "percentage" ? `${depositPercent}% du total TTC` : "Montant forfaitaire"})
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Solde Restant à Livraison :
                    </span>
                    <span className="text-lg font-light font-display text-slate-950 block mt-0.5">
                      {formatFCFA(calculatedBalanceDue)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Payable à la validation finale des livrables
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CARD: Récurrente Configuration when mode is recurring */}
            {invoiceMode === "recurring" && (
              <div className="bg-violet-50/70 rounded-3xl p-5 sm:p-6 border border-violet-200/90 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-violet-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      🔄
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                        Facturation Récurrente & Abonnement
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Automatisez la périodicité et le renouvellement de cette facture
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-200 text-violet-900">
                    Automatisé
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Frequency selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Fréquence de facturation :
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["Mensuelle", "Trimestrielle", "Semestrielle", "Annuelle"] as const).map(
                        (freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => {
                              setRecurringFrequency(freq);
                              setNotes(
                                `Abonnement à facturation récurrente ${freq.toLowerCase()}. Règlement à terme échu sous 14 jours via Mobile Money ou virement.`
                              );
                            }}
                            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${recurringFrequency === freq
                                ? "bg-[#111318] text-white shadow-sm"
                                : "bg-white text-slate-700 hover:bg-violet-100 border border-violet-200"
                              }`}
                          >
                            {freq}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Duration selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Durée de l&apos;engagement :
                    </label>
                    <select
                      value={recurringDuration}
                      onChange={(e) => setRecurringDuration(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-violet-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
                    >
                      <option value="Indéterminée (Tacite reconduction)">
                        Tacite reconduction (Sans fin)
                      </option>
                      <option value="3 mois">Contrat de 3 mois</option>
                      <option value="6 mois">Contrat de 6 mois</option>
                      <option value="12 mois">Contrat de 12 mois (1 an)</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Une nouvelle facture sera automatiquement générée à chaque cycle.
                    </p>
                  </div>
                </div>

                {/* Toggle WhatsApp auto-reminder */}
                <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-violet-200">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💬</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Rappel automatique par WhatsApp
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Avertir le client 3 jours avant chaque nouvelle échéance
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoWhatsappReminder(!autoWhatsappReminder)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${autoWhatsappReminder ? "bg-violet-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${autoWhatsappReminder ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Section 1: Informations Générales */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-violet-600" />
                  <span>Informations de Facturation</span>
                </h3>
                <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Devise : FCFA (XOF)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Select with Quick Create button */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      Client facturé <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsQuickClientOpen(true)}
                      className="text-[11px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 hover:underline"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Nouveau client</span>
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors appearance-none cursor-pointer"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.companyName} — {c.name} ({c.city}, {c.country})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Date d'émission */}
                <DatePicker
                  label="Date d'émission"
                  value={issueDate}
                  onChange={setIssueDate}
                  required
                />

                {/* Date d'échéance */}
                <DatePicker
                  label="Date d'échéance"
                  value={dueDate}
                  onChange={setDueDate}
                  required
                />

                {/* Numéro de facture */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Numéro de facture
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Titre ou Projet */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Intitulé / Projet
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Campagne Digitale Q4"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Lignes de Facture & Prestations */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-600" />
                  <span>Lignes de Facture & Prestations</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  TVA 18% standard UEMOA
                </span>
              </div>

              {/* Items cards list */}
              <div className="space-y-3.5">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Prestation {index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Description input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Description de la prestation ou du produit..."
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "description", e.target.value)
                        }
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    {/* Line calculations: Quantité, Prix unitaire, Total auto */}
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Quantité
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(
                              item.id,
                              "quantity",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center text-slate-900 focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div className="col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Prix Unit. HT (FCFA)
                        </label>
                        <input
                          type="number"
                          step="5000"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(
                              item.id,
                              "unitPrice",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-display focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div className="col-span-4 text-right">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Total Ligne HT
                        </label>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 font-display block py-1.5">
                          {formatFCFA(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-violet-500 bg-white hover:bg-violet-50/40 text-xs font-bold text-slate-700 hover:text-violet-700 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 text-violet-600" />
                <span>Ajouter une ligne de prestation</span>
              </button>
            </div>

            {/* Section 3: Remise, Règlement & Notes */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Règlement & Conditions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mode de règlement */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mode de paiement privilégié
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  >
                    <option value="wave">Wave (Sénégal / Côte d'Ivoire)</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="moov_money">Moov Money</option>
                    <option value="bank_transfer">Virement Bancaire (UEMOA / CEMAC)</option>
                    <option value="cash">Espèces</option>
                  </select>
                </div>

                {/* Remise commerciale */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Remise commerciale (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>

                {/* Notes / Coordonnées */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Coordonnées de règlement ou notes pour le client
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Live total recap at the bottom */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Total net à payer :</span>
                  <span className="text-xl sm:text-2xl font-light text-slate-950 font-display">
                    {formatFCFA(totalTTC)}
                  </span>
                </div>

                <div className="text-right text-slate-500 text-[11px]">
                  <p>HT : {formatFCFA(subtotalHT)}</p>
                  <p>TVA 18% : {formatFCFA(taxTotal)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Real-Time Paper Preview (5 cols) */}
          <div
            className={`xl:col-span-5 sticky top-20 transition-all ${showPreviewMobile ? "block" : "hidden xl:block"
              }`}
          >
            <div className="space-y-4">
              {/* Preview Top Action Header */}
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">
                    Aperçu en direct (Temps réel)
                  </span>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Format A4 UEMOA
                </span>
              </div>

              {/* The Paper Sheet itself */}
              <InvoicePreviewPaper
                invoiceNumber={invoiceNumber}
                client={currentClient}
                issueDate={issueDate}
                dueDate={dueDate}
                items={items}
                subtotalHT={subtotalHT}
                taxTotal={taxTotal}
                totalTTC={totalTTC}
                paymentMethod={paymentMethod}
                notes={notes}
                status="draft"
                discountPercent={discountPercent}
                invoiceMode={invoiceMode}
                depositPercent={depositPercent}
                depositAmount={calculatedDepositAmount}
                recurringFrequency={recurringFrequency}
              />
            </div>
          </div>
        </div>
      </main>
    </div>

    {/* Quick Add Client Modal */}
    {isQuickClientOpen && (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
          <h3 className="text-lg font-bold text-slate-950 mb-1 font-display">
            Ajouter un nouveau client
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Renseignez les coordonnées de l'entreprise cliente pour l'intégrer à la facture.
          </p>

          <form onSubmit={handleCreateQuickClient} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ivoire Logistique SARL"
                value={newClientCompany}
                onChange={(e) => setNewClientCompany(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom du contact / Responsable *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Bakary Koné"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Abidjan"
                  value={newClientCity}
                  onChange={(e) => setNewClientCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  placeholder="+225 07 00 00 00"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email de facturation
              </label>
              <input
                type="email"
                placeholder="compta@entreprise.ci"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-violet-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setIsQuickClientOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#111318] hover:bg-violet-600 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Créer et Sélectionner
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Chargement de l'éditeur...</div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
