"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { StatusBadge, PaymentMethodBadge } from "@/components/ui/StatusBadge";
import { useApp } from "@/lib/store-context";
import { Client, PaymentMethod, Payment, ClientReminder, Invoice } from "@/lib/types";
import { formatFCFA, formatDateFR } from "@/lib/money";
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Trash2,
  FilePlus,
  MessageCircle,
  ExternalLink,
  X,
  Check,
  TrendingUp,
  CreditCard,
  Briefcase,
  AlertTriangle,
  Globe,
  LayoutGrid,
  List,
  BellRing,
  Calendar,
  BarChart3,
  Send,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Filter,
  Printer,
  Sparkles,
} from "lucide-react";

const UEMOA_CITIES = [
  { city: "Abidjan", country: "Côte d'Ivoire" },
  { city: "Dakar", country: "Sénégal" },
  { city: "Cotonou", country: "Bénin" },
  { city: "Lomé", country: "Togo" },
  { city: "Ouagadougou", country: "Burkina Faso" },
  { city: "Douala", country: "Cameroun" },
  { city: "Bamako", country: "Mali" },
  { city: "Niamey", country: "Niger" },
];

const AVATAR_COLORS = [
  "bg-violet-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-cyan-600",
];

type SubSectionTab = "directory" | "payments" | "reminders" | "deadlines" | "reports";

function ClientsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    clients,
    invoices,
    payments,
    reminders,
    addClient,
    updateClient,
    deleteClient,
    addPayment,
    sendReminder,
    updateInvoiceStatus,
  } = useApp();

  // Active Sub-section Tab
  const [activeTab, setActiveTab] = useState<SubSectionTab>("directory");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "payments" || tabParam === "paiements") setActiveTab("payments");
    else if (tabParam === "reminders" || tabParam === "relances") setActiveTab("reminders");
    else if (tabParam === "deadlines" || tabParam === "echeances") setActiveTab("deadlines");
    else if (tabParam === "reports" || tabParam === "rapports") setActiveTab("reports");
    else if (tabParam === "directory" || tabParam === "clients") setActiveTab("directory");
  }, [searchParams]);

  // Directory state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Client Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  // New Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payClientId, setPayClientId] = useState<string>(clients[0]?.id || "");
  const [payInvoiceNumber, setPayInvoiceNumber] = useState<string>("");
  const [payAmount, setPayAmount] = useState<number>(500000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("wave");
  const [payRef, setPayRef] = useState<string>(`WAV-${Date.now().toString().slice(-6)}`);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("Abidjan");
  const [formCountry, setFormCountry] = useState("Côte d'Ivoire");
  const [formAddress, setFormAddress] = useState("");

  // Summary Metrics
  const totalClients = clients.length;
  const totalBilledAll = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalInvoicesCount = invoices.length;
  const uniqueCitiesCount = new Set(clients.map((c) => c.city)).size;

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (selectedCity !== "all" && client.city !== selectedCity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = client.name.toLowerCase().includes(q);
        const matchCompany = client.companyName.toLowerCase().includes(q);
        const matchEmail = client.email.toLowerCase().includes(q);
        const matchPhone = client.phone.toLowerCase().includes(q);
        const matchCity = client.city.toLowerCase().includes(q);
        return matchName || matchCompany || matchEmail || matchPhone || matchCity;
      }
      return true;
    });
  }, [clients, selectedCity, searchQuery]);

  // Client stats helper
  const getClientStats = (clientId: string) => {
    const clientInvoices = invoices.filter((i) => i.client.id === clientId);
    const totalBilled = clientInvoices.reduce((sum, i) => sum + i.total, 0);
    const paidCount = clientInvoices.filter((i) => i.status === "paid").length;
    const unpaidCount = clientInvoices.filter(
      (i) => i.status === "sent" || i.status === "overdue"
    ).length;
    return {
      invoicesCount: clientInvoices.length,
      totalBilled,
      paidCount,
      unpaidCount,
    };
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormName("");
    setFormCompany("");
    setFormEmail("");
    setFormPhone("+225 ");
    setFormCity("Abidjan");
    setFormCountry("Côte d'Ivoire");
    setFormAddress("");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormCompany(client.companyName);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormCity(client.city);
    setFormCountry(client.country);
    setFormAddress(client.address || "");
  };

  // Handle City Change in Form
  const handleFormCityChange = (city: string) => {
    setFormCity(city);
    const match = UEMOA_CITIES.find((c) => c.city === city);
    if (match) {
      setFormCountry(match.country);
    }
  };

  // Save New Client
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() && !formName.trim()) return;

    const initials = (formCompany || formName)
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const randomColor =
      AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: formName.trim() || formCompany.trim(),
      companyName: formCompany.trim() || formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      city: formCity,
      country: formCountry,
      address: formAddress.trim(),
      avatarColor: randomColor,
      initials: initials || "CL",
    };

    const res = await addClient(newClient);
    if (res.success) {
      setIsAddModalOpen(false);
    } else {
      alert(`Erreur d'enregistrement dans la base de données : ${res.error}`);
    }
  };

  // Save Edit Client
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const initials = (formCompany || formName)
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const updatedClient: Client = {
      ...editingClient,
      name: formName.trim() || formCompany.trim(),
      companyName: formCompany.trim() || formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      city: formCity,
      country: formCountry,
      address: formAddress.trim(),
      initials: initials || editingClient.initials,
    };

    const res = await updateClient(updatedClient);
    if (res.success) {
      setEditingClient(null);
    } else {
      alert(`Erreur de mise à jour dans la base de données : ${res.error}`);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (deletingClient) {
      const res = await deleteClient(deletingClient.id);
      if (res.success) {
        setDeletingClient(null);
      } else {
        alert(`Erreur de suppression dans la base de données : ${res.error}`);
      }
    }
  };

  // Save New Payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === payClientId) || clients[0];
    const newPay: Payment = {
      id: `pay_${Date.now()}`,
      invoiceNumber: payInvoiceNumber || "FAC-2024-0042",
      clientName: client?.companyName || "Client Partenaire",
      amount: Number(payAmount),
      method: payMethod,
      date: new Date().toISOString().split("T")[0],
      reference: payRef || `PAY-${Date.now().toString().slice(-6)}`,
    };
    addPayment(newPay);
    setIsPaymentModalOpen(false);
  };

  // Send WhatsApp Reminder
  const triggerWhatsAppReminder = (rem: ClientReminder) => {
    const cleanPhone = rem.clientPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Bonjour ${rem.clientName} (${rem.companyName}),\n\n${rem.messagePreview}\n\nModes de règlement acceptés : Wave (+225 07 88 45 12 90), Orange Money ou Virement Bancaire.\nMerci de nous tenir informés dès l'émission de votre transfert.\nBien cordialement,\nL'équipe izi facture.`
    );
    sendReminder(rem.id);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Count pending reminders & deadlines
  const pendingRemindersCount = reminders.filter((r) => r.status === "pending").length;
  const pendingInvoices = invoices.filter((i) => i.status === "sent" || i.status === "overdue");

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar */}
      <SidebarRail />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav activeTab="customers" />
        <TopNav activeTab="customers" />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Espace Commercial & Financier
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-500 font-medium">Zone UEMOA / CEMAC</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                Gestion des Clients & Trésorerie
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Pilotez votre portefeuille clients, encaissements, relances de paiement, échéances et rapports.
              </p>
            </div>

            {/* Quick Actions (Strict Rule GEMINI.md: black -> violet with 90deg + rotation) */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                onClick={openAddModal}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#111318] text-white text-xs font-bold transition-all duration-300 hover:bg-violet-600 active:bg-violet-700 hover:shadow-md hover:shadow-violet-500/25 active:scale-95"
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90 text-violet-300" />
                <span>Nouveau Client</span>
              </button>
            </div>
          </div>

          {/* Sub-sections Navigation Bar (Requested by user: Paiements, Relances, Échéances, Rapports) */}
          <div className="bg-white rounded-3xl p-2 sm:p-2.5 border border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
            <nav className="flex items-center gap-1.5 min-w-[620px]">
              {/* Tab 1: Répertoire */}
              <button
                onClick={() => setActiveTab("directory")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === "directory"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Répertoire Clients</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "directory" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {clients.length}
                </span>
              </button>

              {/* Tab 2: Paiements */}
              <button
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === "payments"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Paiements & Modes</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "payments" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                    }`}
                >
                  {payments.length}
                </span>
              </button>

              {/* Tab 3: Relances */}
              <button
                onClick={() => setActiveTab("reminders")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === "reminders"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <BellRing className="w-4 h-4" />
                <span>Relances Clients</span>
                {pendingRemindersCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "reminders" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-800 animate-pulse"
                      }`}
                  >
                    {pendingRemindersCount}
                  </span>
                )}
              </button>

              {/* Tab 4: Échéances */}
              <button
                onClick={() => setActiveTab("deadlines")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === "deadlines"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Échéances</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "deadlines" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                    }`}
                >
                  {pendingInvoices.length}
                </span>
              </button>

              {/* Tab 5: Rapports */}
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${activeTab === "reports"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Rapports</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "reports" ? "bg-white/20 text-white" : "bg-violet-100 text-violet-800"
                    }`}
                >
                  Analyses
                </span>
              </button>
            </nav>
          </div>

          {/* ========================================================================= */}
          {/* SUB-SECTION 1: RÉPERTOIRE CLIENTS */}
          {/* ========================================================================= */}
          {activeTab === "directory" && (
            <div className="space-y-6 animate-in fade-in">
              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Portefeuille Clients
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                    {totalClients}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Comptes professionnels actifs</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Facturé
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display truncate">
                    {formatFCFA(totalBilledAll)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Chiffre d&apos;affaires cumulé</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Factures Émises
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                    {totalInvoicesCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Documents commerciaux</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Villes UEMOA
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-light text-slate-950 font-display">
                    {uniqueCitiesCount}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">Présence régionale Afrique</p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
                    <button
                      onClick={() => setSelectedCity("all")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${selectedCity === "all"
                          ? "bg-slate-950 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      Toutes les villes ({clients.length})
                    </button>
                    {UEMOA_CITIES.map((c) => {
                      const count = clients.filter((cl) => cl.city === c.city).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={c.city}
                          onClick={() => setSelectedCity(c.city)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${selectedCity === c.city
                              ? "bg-violet-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          {c.city} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative group flex-1 sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher nom, entreprise, ville..."
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

                    <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                          }`}
                        title="Vue Grille"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-xl transition-all ${viewMode === "table" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                          }`}
                        title="Vue Tableau"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid or Table Cards */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => {
                      const stats = getClientStats(client.id);
                      const clientPhoneClean = client.phone.replace(/[^0-9]/g, "");
                      const whatsappUrl = `https://wa.me/${clientPhoneClean}`;

                      return (
                        <div
                          key={client.id}
                          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-12 h-12 rounded-2xl ${client.avatarColor || "bg-violet-600"} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200`}
                                >
                                  {client.initials}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-slate-950 text-sm truncate group-hover:text-violet-900 transition-colors">
                                    {client.companyName}
                                  </h3>
                                  <p className="text-xs text-slate-500 truncate">{client.name}</p>
                                </div>
                              </div>

                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 shrink-0">
                                {client.city}
                              </span>
                            </div>

                            <div className="space-y-1.5 py-2.5 border-y border-slate-100 text-xs text-slate-600">
                              <div className="flex items-center gap-2 truncate">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <a href={`mailto:${client.email}`} className="hover:text-violet-600 truncate transition-colors">
                                  {client.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono text-slate-800">{client.phone}</span>
                              </div>
                              {client.address && (
                                <div className="flex items-center gap-2 truncate text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{client.address}</span>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Total Facturé
                                </span>
                                <span className="font-light text-slate-950 font-display text-sm block mt-0.5 truncate">
                                  {formatFCFA(stats.totalBilled)}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Factures
                                </span>
                                <span className="font-bold text-slate-900 text-xs block mt-0.5">
                                  {stats.invoicesCount} doc{stats.invoicesCount > 1 ? "s" : ""}
                                  {stats.unpaidCount > 0 && (
                                    <span className="ml-1 text-[10px] font-bold text-rose-600">
                                      ({stats.unpaidCount} dû)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <Link
                              href={`/factures/nouvelle?client=${client.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-violet-600 active:bg-violet-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm active:scale-95"
                              title="Créer une nouvelle facture pour ce client"
                            >
                              <FilePlus className="w-3.5 h-3.5 text-violet-300" />
                              <span>+ Facture</span>
                            </Link>

                            <div className="flex items-center gap-1">
                              {clientPhoneClean && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-all border border-emerald-200/60"
                                  title="Contacter sur WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => openEditModal(client)}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                                title="Modifier les coordonnées"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingClient(client)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all border border-rose-200/50"
                                title="Supprimer le client"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Aucun client trouvé</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Aucun client ne correspond à votre recherche.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Table View */
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                          <th className="py-3 px-4">Client / Entreprise</th>
                          <th className="py-3 px-4">Ville & Pays</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4 text-right">Total Facturé</th>
                          <th className="py-3 px-4 text-center">Factures</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredClients.map((client) => {
                          const stats = getClientStats(client.id);
                          return (
                            <tr key={client.id} className="hover:bg-violet-50/25 transition-all duration-150 group">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-2xl ${client.avatarColor || "bg-violet-600"} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}
                                  >
                                    {client.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-950 truncate group-hover:text-violet-900 transition-colors">
                                      {client.companyName}
                                    </p>
                                    <p className="text-[11px] text-slate-500 truncate">{client.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                                  {client.city}, {client.country}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-mono text-slate-800">{client.phone}</p>
                                <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{client.email}</p>
                              </td>
                              <td className="py-3.5 px-4 text-right font-light text-slate-950 font-display text-sm">
                                {formatFCFA(stats.totalBilled)}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {stats.invoicesCount} doc{stats.invoicesCount > 1 ? "s" : ""}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Link
                                    href={`/factures/nouvelle?client=${client.id}`}
                                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-violet-600 text-white rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Facture</span>
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(client)}
                                    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingClient(client)}
                                    className="w-7 h-7 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all border border-rose-200/50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECTION 2: PAIEMENTS (Modes de paiement & Transactions reçues) */}
          {/* ========================================================================= */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Payment Methods Config Cards */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Modes de Règlement Acceptés pour vos Clients
                    </h3>
                    <p className="text-xs text-slate-500">
                      Canaux de paiement disponibles pour l&apos;encaissement de vos factures en Zone UEMOA.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-sm active:scale-95 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Enregistrer un Paiement</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Wave */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sky-900 text-sm">Wave Mobile Money</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-sky-800 font-mono">+225 07 88 45 12 90</p>
                    <p className="text-[10px] text-sky-700">Frais 1% · Encaissement instantané CI & SN</p>
                  </div>

                  {/* Orange Money */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-orange-900 text-sm">Orange Money</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    </div>
                    <p className="text-[11px] text-orange-800 font-mono">Code Marchand : 489201</p>
                    <p className="text-[10px] text-orange-700">Couverture UEMOA (CI, SN, ML, BF)</p>
                  </div>

                  {/* MTN MoMo */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-900 text-sm">MTN MoMo & Moov</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-[11px] text-amber-800 font-mono">+229 97 12 45 88</p>
                    <p className="text-[10px] text-amber-700">Mobile Money Bénin & Côte d&apos;Ivoire</p>
                  </div>

                  {/* Virement Bancaire */}
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-indigo-900 text-sm">Virement Bancaire</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    </div>
                    <p className="text-[11px] text-indigo-800 font-mono">Ecobank / UBA / SG</p>
                    <p className="text-[10px] text-indigo-700">IBAN CI059 01001 0023456789</p>
                  </div>
                </div>
              </div>

              {/* Transactions History Table */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Historique des Règlements Reçus
                    </h3>
                    <p className="text-xs text-slate-500">
                      Traçabilité complète des versements clients enregistrés sur le compte.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    Total : {formatFCFA(payments.reduce((s, p) => s + p.amount, 0))}
                  </span>
                </div>

                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Facture Réf.</th>
                        <th className="py-3 px-3">Mode de Règlement</th>
                        <th className="py-3 px-3">Réf. Transaction</th>
                        <th className="py-3 px-3 text-right">Montant Encaissé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-3 font-medium text-slate-600 whitespace-nowrap">
                            {formatDateFR(p.date)}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-950">
                            {p.clientName}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200">
                              {p.invoiceNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <PaymentMethodBadge method={p.method} />
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                            {p.reference}
                          </td>
                          <td className="py-3.5 px-3 text-right font-light text-emerald-700 font-display text-sm font-bold">
                            +{formatFCFA(p.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECTION 3: RELANCES (Reminders clients avant/après échéance) */}
          {/* ========================================================================= */}
          {activeTab === "reminders" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Info banner */}
              <div className="bg-gradient-to-r from-violet-900 to-[#111318] text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Système Automatisé de Reminders
                  </span>
                  <h3 className="text-lg font-bold font-display">
                    Relances & Recouvrement Amiable
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Envoyez en un clic un message de rappel personnalisé par WhatsApp ou Email pour accélérer vos encaissements sans dégrader la relation commerciale.
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/15 text-center shrink-0">
                  <span className="text-2xl font-bold font-display text-white">{pendingRemindersCount}</span>
                  <span className="text-[10px] text-slate-300 block font-bold uppercase">À relancer</span>
                </div>
              </div>

              {/* Reminders List Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reminders.map((rem) => {
                  const isLate = rem.daysLate > 0;
                  return (
                    <div
                      key={rem.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-sm">
                              {rem.companyName}
                            </span>
                            {isLate ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                Retard de {rem.daysLate}j
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold">
                                Échéance à J{rem.daysLate}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Contact : {rem.clientName} · Réf. {rem.invoiceNumber}
                          </p>
                        </div>

                        <span className="font-display font-light text-slate-950 text-base font-bold">
                          {formatFCFA(rem.balanceDue)}
                        </span>
                      </div>

                      {/* Message preview box */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 italic space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 not-italic block">
                          Aperçu du rappel :
                        </span>
                        <p className="line-clamp-2">{rem.messagePreview}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-500">
                          Canal privilégié : <strong className="text-slate-800 uppercase">{rem.channel}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => triggerWhatsAppReminder(rem)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95"
                            title="Envoyer le rappel sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Relancer WhatsApp</span>
                          </button>

                          <a
                            href={`mailto:${rem.clientEmail}?subject=Rappel%20Facture%20${rem.invoiceNumber}&body=${encodeURIComponent(rem.messagePreview)}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Envoyer par email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECTION 4: ÉCHÉANCES (Factures à payer avant la date limite) */}
          {/* ========================================================================= */}
          {activeTab === "deadlines" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Calendrier & Échéances de Règlement par Client
                    </h3>
                    <p className="text-xs text-slate-500">
                      Toutes les factures clients en attente de paiement avant leur date limite.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-bold">
                      {invoices.filter((i) => i.status === "overdue").length} en retard
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                      {invoices.filter((i) => i.status === "sent").length} en attente
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3 px-3">Date Limite (Échéance)</th>
                        <th className="py-3 px-3">Client / Entreprise</th>
                        <th className="py-3 px-3">N° Facture</th>
                        <th className="py-3 px-3">Émission</th>
                        <th className="py-3 px-3 text-right">Montant Total</th>
                        <th className="py-3 px-3 text-right">Reste à Payer</th>
                        <th className="py-3 px-3 text-center">Urgence</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {invoices
                        .filter((i) => i.status === "sent" || i.status === "overdue")
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((inv) => {
                          const isOverdue = inv.status === "overdue";
                          return (
                            <tr
                              key={inv.id}
                              className={`transition-colors ${isOverdue ? "bg-rose-50/20 hover:bg-rose-50/40" : "hover:bg-slate-50/60"
                                }`}
                            >
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span className={`font-bold ${isOverdue ? "text-rose-700" : "text-slate-900"}`}>
                                  {formatDateFR(inv.dueDate)}
                                </span>
                              </td>
                              <td className="py-3.5 px-3">
                                <p className="font-bold text-slate-900">{inv.client.companyName}</p>
                                <p className="text-[10px] text-slate-500">{inv.client.name} · {inv.client.city}</p>
                              </td>
                              <td className="py-3.5 px-3">
                                <Link
                                  href={`/factures/${inv.id}`}
                                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-violet-100 text-slate-800 hover:text-violet-900 font-mono text-[11px] font-bold border border-slate-200 transition-colors"
                                >
                                  {inv.number}
                                </Link>
                              </td>
                              <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                                {formatDateFR(inv.issueDate)}
                              </td>
                              <td className="py-3.5 px-3 text-right font-light text-slate-950 font-display text-sm">
                                {formatFCFA(inv.total)}
                              </td>
                              <td className="py-3.5 px-3 text-right font-bold font-mono text-rose-700">
                                {formatFCFA(inv.balanceDue)}
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                {isOverdue ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                                    Dépassée
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-300">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    À venir
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => updateInvoiceStatus(inv.id, "paid")}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 text-[10px] font-bold transition-all shadow-sm active:scale-95"
                                >
                                  Encaisser
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-SECTION 5: RAPPORTS (Analyses et rapports d'activité clients) */}
          {/* ========================================================================= */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Row: Ranking & Average Payment Delay */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Top Clients by Revenue */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Top Clients par Chiffre d&apos;Affaires
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                      Pondération CA
                    </span>
                  </div>

                  <div className="space-y-3">
                    {clients
                      .map((c) => ({
                        ...c,
                        totalBilled: getClientStats(c.id).totalBilled,
                      }))
                      .sort((a, b) => b.totalBilled - a.totalBilled)
                      .slice(0, 5)
                      .map((c, idx) => {
                        const pct = totalBilledAll > 0 ? Math.round((c.totalBilled / totalBilledAll) * 100) : 0;
                        return (
                          <div key={c.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900">
                                #{idx + 1} {c.companyName}
                              </span>
                              <span className="font-mono font-bold text-slate-800">
                                {formatFCFA(c.totalBilled)} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-violet-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Regional performance UEMOA */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Répartition Régionale UEMOA / CEMAC
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Hubs Financiers
                    </span>
                  </div>

                  <div className="space-y-3">
                    {UEMOA_CITIES.map((city) => {
                      const cityClients = clients.filter((c) => c.city === city.city);
                      if (cityClients.length === 0) return null;
                      const cityTotal = cityClients.reduce(
                        (sum, c) => sum + getClientStats(c.id).totalBilled,
                        0
                      );
                      const pct = totalBilledAll > 0 ? Math.round((cityTotal / totalBilledAll) * 100) : 0;
                      return (
                        <div key={city.city} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                              {city.city} ({city.country})
                            </span>
                            <span className="font-mono font-bold text-slate-800">
                              {formatFCFA(cityTotal)}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recovery KPI banner */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Taux de Recouvrement
                  </span>
                  <span className="text-3xl font-light text-emerald-950 font-display block mt-1">
                    94.2%
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-1">Excellent respect des échéances</p>
                </div>

                <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200">
                  <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block">
                    Délai Moyen de Règlement
                  </span>
                  <span className="text-3xl font-light text-violet-950 font-display block mt-1">
                    12 Jours
                  </span>
                  <p className="text-[11px] text-violet-700 mt-1">Zone UEMOA (Standard : 30j)</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Canal Principal
                  </span>
                  <span className="text-3xl font-light text-slate-950 font-display block mt-1">
                    Wave & Virement
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">78% du volume financier</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Ajouter un Client */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Nouveau Client</h3>
                  <p className="text-[11px] text-slate-500">Ajoutez une entreprise ou un particulier</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Raison Sociale / Entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sahel Agrobusiness SARL"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nom du Contact Principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Amadou Diallo"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Professionnel
                  </label>
                  <input
                    type="email"
                    placeholder="contact@entreprise.ci"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Téléphone (avec indicatif)
                  </label>
                  <input
                    type="tel"
                    placeholder="+225 07 48 92 11 00"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Ville (Zone UEMOA / CEMAC)
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => handleFormCityChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors font-medium"
                  >
                    {UEMOA_CITIES.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formCountry}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Adresse Physique
                </label>
                <input
                  type="text"
                  placeholder="Ex: Plateau, Immeuble Horizon, Rue des Banques"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#111318] hover:bg-violet-600 active:bg-violet-700 active:scale-95 transition-all shadow-sm"
                >
                  Enregistrer le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Modifier un Client */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Modifier {editingClient.companyName}
                  </h3>
                  <p className="text-[11px] text-slate-500">Mettez à jour les coordonnées</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Raison Sociale / Entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nom du Contact
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Ville
                  </label>
                  <select
                    value={formCity}
                    onChange={(e) => handleFormCityChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors font-medium"
                  >
                    {UEMOA_CITIES.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formCountry}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Adresse Physique
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-sm"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmer la Suppression d'un Client */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setDeletingClient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Supprimer {deletingClient.companyName} ?
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Êtes-vous certain de vouloir supprimer ce client de votre répertoire ? Ses factures existantes resteront archivées dans l&apos;historique.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingClient(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-sm"
              >
                Supprimer le client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Enregistrer un Paiement */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Enregistrer un Paiement Client
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Client concerné
                </label>
                <select
                  value={payClientId}
                  onChange={(e) => setPayClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Réf. Facture liée
                </label>
                <input
                  type="text"
                  placeholder="Ex: FAC-2024-0042"
                  value={payInvoiceNumber}
                  onChange={(e) => setPayInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Montant Encaissé (FCFA)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Mode de Règlement
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="wave">Wave</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="mtn_momo">MTN MoMo</option>
                    <option value="moov_money">Moov</option>
                    <option value="bank_transfer">Virement</option>
                    <option value="cash">Espèces</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Référence Transaction
                </label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Chargement de l&apos;espace clients...</div>}>
      <ClientsPageContent />
    </Suspense>
  );
}
