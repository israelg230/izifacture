"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useApp } from "@/lib/store-context";
import { formatFCFA } from "@/lib/money";
import {
  Settings,
  Building2,
  FileText,
  CreditCard,
  BellRing,
  Users,
  ShieldCheck,
  Save,
  CheckCircle2,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Smartphone,
  Landmark,
  BadgePercent,
  Check,
  AlertCircle,
} from "lucide-react";

type SettingsTab =
  | "company"
  | "billing"
  | "payments"
  | "reminders"
  | "team"
  | "security";

export default function ParametresPage() {
  const { showToast, invoices, clients, quotes, companySettings, updateCompanySettings } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>("company");

  // Company Profile Settings
  const [companyName, setCompanyName] = useState(companySettings.companyName);
  const [tradeName, setTradeName] = useState(companySettings.tradeName);
  const [rccm, setRccm] = useState(companySettings.rccm);
  const [ncc, setNcc] = useState(companySettings.ncc);
  const [email, setEmail] = useState(companySettings.email);
  const [phone, setPhone] = useState(companySettings.phone);
  const [address, setAddress] = useState(companySettings.address);
  const [city, setCity] = useState(companySettings.city);
  const [country, setCountry] = useState(companySettings.country);
  const [website, setWebsite] = useState(companySettings.website);

  // Invoicing & Tax Settings
  const [currency] = useState("FCFA (XOF)");
  const [defaultTaxRate, setDefaultTaxRate] = useState<number>(companySettings.defaultTaxRate);
  const [invoicePrefix, setInvoicePrefix] = useState(companySettings.invoicePrefix);
  const [quotePrefix, setQuotePrefix] = useState(companySettings.quotePrefix);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(companySettings.nextInvoiceNumber || "0043");
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(companySettings.paymentTermsDays);
  const [legalNotice, setLegalNotice] = useState(companySettings.legalNotice);

  // Payment Gateways Settings
  const [waveEnabled, setWaveEnabled] = useState(companySettings.waveEnabled);
  const [wavePhone, setWavePhone] = useState(companySettings.wavePhone);
  const [waveMerchantName, setWaveMerchantName] = useState(companySettings.waveMerchantName);

  const [omEnabled, setOmEnabled] = useState(companySettings.omEnabled);
  const [omMerchantCode, setOmMerchantCode] = useState(companySettings.omMerchantCode);

  const [mtnEnabled, setMtnEnabled] = useState(companySettings.mtnEnabled);
  const [mtnPhone, setMtnPhone] = useState(companySettings.mtnPhone);

  const [bankName, setBankName] = useState(companySettings.bankName);
  const [bankAccountName, setBankAccountName] = useState(companySettings.bankAccountName);
  const [bankIban, setBankIban] = useState(companySettings.bankIban);
  const [bankSwift, setBankSwift] = useState(companySettings.bankSwift);


  // Reminders Settings
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState(true);
  const [preDueDays, setPreDueDays] = useState(3);
  const [reminder1Days, setReminder1Days] = useState(1);
  const [reminder2Days, setReminder2Days] = useState(7);
  const [reminderWhatsappTemplate, setReminderWhatsappTemplate] = useState(
    "Bonjour {client}, rappel amical concernant votre facture {facture} d'un montant de {montant} arrivant à échéance le {echeance}. Règlement possible via Wave au {wave}. Merci pour votre confiance !"
  );

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "usr_1",
      name: "Israel G.",
      email: "israel@afrikinnovations.ci",
      role: "Administrateur & Fondateur",
      badge: "Accès Total",
      avatarBg: "bg-violet-600",
      initials: "IG",
    },
    {
      id: "usr_2",
      name: "Awa Diallo",
      email: "awa.compta@afrikinnovations.ci",
      role: "Responsable Comptabilité",
      badge: "Gestion Financière",
      avatarBg: "bg-emerald-600",
      initials: "AD",
    },
    {
      id: "usr_3",
      name: "Jean-Luc Mensah",
      email: "jl.mensah@afrikinnovations.ci",
      role: "Chargé Commercial",
      badge: "Devis & Factures",
      avatarBg: "bg-indigo-600",
      initials: "JM",
    },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Chargé Commercial");

  // Restore settings from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("izi_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.rccm) setRccm(parsed.rccm);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.wavePhone) setWavePhone(parsed.wavePhone);
        if (parsed.bankIban) setBankIban(parsed.bankIban);
        if (parsed.defaultTaxRate !== undefined) setDefaultTaxRate(parsed.defaultTaxRate);
      }
    } catch {}
  }, []);

  // Save Settings Handler
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const settingsObject = {
      companyName,
      tradeName,
      rccm,
      ncc,
      email,
      phone,
      address,
      city,
      country,
      website,
      defaultTaxRate,
      invoicePrefix,
      quotePrefix,
      nextInvoiceNumber,
      paymentTermsDays,
      legalNotice,
      waveEnabled,
      wavePhone,
      waveMerchantName,
      omEnabled,
      omMerchantCode,
      mtnEnabled,
      mtnPhone,
      bankName,
      bankAccountName,
      bankIban,
      bankSwift,
      autoRemindersEnabled,
      preDueDays,
      reminder1Days,
      reminder2Days,
      reminderWhatsappTemplate,
    };

    try {
      localStorage.setItem("izi_settings", JSON.stringify(settingsObject));
    } catch {}

    updateCompanySettings(settingsObject);
    showToast("Paramètres de l'entreprise enregistrés avec succès !");
  };

  // Add Team Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const initials = inviteName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const newMember = {
      id: `usr_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      badge: inviteRole === "Comptable" ? "Gestion Financière" : "Commercial",
      avatarBg: "bg-blue-600",
      initials: initials || "CL",
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    showToast(`Invitation transmise à ${inviteName} !`);
  };

  // Export Data JSON
  const handleExportData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      company: { companyName, rccm, email, phone, city, country },
      invoicesCount: invoices.length,
      clientsCount: clients.length,
      quotesCount: quotes.length,
      invoices,
      clients,
      quotes,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `izi_facture_sauvegarde_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Sauvegarde intégrale des données téléchargée !");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar */}
      <SidebarRail />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav activeTab="settings" />
        <TopNav activeTab="settings" />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-6 pb-28 sm:pb-32 lg:pb-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Configuration de l&apos;Espace SaaS
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-500 font-medium">Zone UEMOA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                Paramètres & Entreprise
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Gérez l&apos;identité légale de votre entreprise, vos coordonnées de facturation, passerelles Mobile Money et équipe.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold border border-slate-200 transition-all shadow-sm"
                title="Exporter toutes les données en JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#111318] text-white text-xs font-bold transition-all duration-300 hover:bg-violet-600 active:bg-violet-700 hover:shadow-md hover:shadow-violet-500/25 active:scale-95"
              >
                <Save className="w-4 h-4 text-violet-300 transition-transform group-hover:scale-110" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Left Tabs Sidebar (3 cols) & Right Tab Content (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Vertical Navigation Tabs */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("company")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "company"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Profil Entreprise</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "company" ? "text-slate-300" : "text-slate-400"}`}>
                    Raison sociale, RCCM, adresse
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "billing"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Facturation & TVA</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "billing" ? "text-slate-300" : "text-slate-400"}`}>
                    TVA 18%, numérotation, CGV
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "payments"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Passerelles de Paiement</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "payments" ? "text-slate-300" : "text-slate-400"}`}>
                    Wave, OM, MoMo, RIB bancaire
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reminders")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "reminders"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <BellRing className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Relances & Messages</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "reminders" ? "text-slate-300" : "text-slate-400"}`}>
                    Modèles WhatsApp, délais
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("team")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "team"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Équipe & Accès</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "team" ? "text-slate-300" : "text-slate-400"}`}>
                    {teamMembers.length} collaborateurs
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                  activeTab === "security"
                    ? "bg-[#111318] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate">Sécurité & Sauvegarde</p>
                  <p className={`text-[10px] font-normal truncate ${activeTab === "security" ? "text-slate-300" : "text-slate-400"}`}>
                    2FA, exports, intégrité
                  </p>
                </div>
              </button>
            </div>

            {/* Right Column: Tab Content Panel (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* ============================================================= */}
              {/* TAB 1: PROFIL ENTREPRISE */}
              {/* ============================================================= */}
              {activeTab === "company" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Identité Légale & Profil d&apos;Émetteur
                      </h2>
                      <p className="text-xs text-slate-500">
                        Ces mentions figurent obligatoirement sur l&apos;en-tête de vos factures et devis UEMOA.
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                      i
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAll();
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Raison Sociale Officielle *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Nom Commercial / Marque
                        </label>
                        <input
                          type="text"
                          value={tradeName}
                          onChange={(e) => setTradeName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Numéro RCCM *
                        </label>
                        <input
                          type="text"
                          required
                          value={rccm}
                          onChange={(e) => setRccm(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Numéro Compte Contribuable (NCC / IFU / NIF)
                        </label>
                        <input
                          type="text"
                          value={ncc}
                          onChange={(e) => setNcc(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Email de Contact & Facturation
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Téléphone Professionnel
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Adresse du Siège Social
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Ville Principale
                        </label>
                        <select
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (e.target.value === "Abidjan") setCountry("Côte d'Ivoire");
                            else if (e.target.value === "Dakar") setCountry("Sénégal");
                            else if (e.target.value === "Cotonou") setCountry("Bénin");
                            else if (e.target.value === "Lomé") setCountry("Togo");
                            else if (e.target.value === "Douala") setCountry("Cameroun");
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium"
                        >
                          <option value="Abidjan">Abidjan (Côte d&apos;Ivoire)</option>
                          <option value="Dakar">Dakar (Sénégal)</option>
                          <option value="Cotonou">Cotonou (Bénin)</option>
                          <option value="Lomé">Lomé (Togo)</option>
                          <option value="Douala">Douala (Cameroun)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#111318] hover:bg-violet-600 text-white rounded-2xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer le Profil</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: FACTURATION & TVA */}
              {/* ============================================================= */}
              {activeTab === "billing" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Paramètres Fiscaux & Facturation UEMOA
                      </h2>
                      <p className="text-xs text-slate-500">
                        Configuration de la TVA 18%, de la devise FCFA et des délais de paiement par défaut.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold border border-violet-200">
                      Standard UEMOA
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAll();
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Devise de Compte Fixe
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="Franc CFA — XOF / FCFA (Aucun centime)"
                          className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-700 font-bold cursor-not-allowed"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Conforme aux exigences bancaires de la zone BCEAO / BEAC.
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Taux de TVA Standard
                        </label>
                        <select
                          value={defaultTaxRate}
                          onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-bold"
                        >
                          <option value={18}>18% (Norme standard UEMOA)</option>
                          <option value={0}>0% (Régime d&apos;exonération / Export)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Préfixe Factures
                        </label>
                        <input
                          type="text"
                          value={invoicePrefix}
                          onChange={(e) => setInvoicePrefix(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Préfixe Devis
                        </label>
                        <input
                          type="text"
                          value={quotePrefix}
                          onChange={(e) => setQuotePrefix(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Délai d&apos;Échéance par Défaut
                        </label>
                        <select
                          value={paymentTermsDays}
                          onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900"
                        >
                          <option value={7}>7 jours</option>
                          <option value={14}>14 jours (Recommandé)</option>
                          <option value={30}>30 jours (Fin de mois)</option>
                          <option value={60}>60 jours</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Mentions Légales & Conditions de Vente en Bas de Facture
                      </label>
                      <textarea
                        rows={3}
                        value={legalNotice}
                        onChange={(e) => setLegalNotice(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#111318] hover:bg-violet-600 text-white rounded-2xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les Règles de Facturation</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: PASSERELLES & PAIEMENTS */}
              {/* ============================================================= */}
              {activeTab === "payments" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Passerelles d&apos;Encaissement & Mobile Money
                      </h2>
                      <p className="text-xs text-slate-500">
                        Configurez vos coordonnées Wave, Orange Money et bancaires apparaissant sur vos factures.
                      </p>
                    </div>
                    <CreditCard className="w-6 h-6 text-slate-400" />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAll();
                    }}
                    className="space-y-5 text-xs"
                  >
                    {/* Wave Business */}
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-sky-500" />
                          <h4 className="font-bold text-sky-950 text-sm">Compte Wave Marchand</h4>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={waveEnabled}
                            onChange={(e) => setWaveEnabled(e.target.checked)}
                            className="rounded text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-[11px] font-bold text-sky-900">Actif</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 uppercase mb-1">
                            Numéro Wave Dédié
                          </label>
                          <input
                            type="tel"
                            value={wavePhone}
                            onChange={(e) => setWavePhone(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800 uppercase mb-1">
                            Nom du Marchand Wave
                          </label>
                          <input
                            type="text"
                            value={waveMerchantName}
                            onChange={(e) => setWaveMerchantName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Orange Money */}
                    <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-orange-500" />
                          <h4 className="font-bold text-orange-950 text-sm">Orange Money Marchand</h4>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={omEnabled}
                            onChange={(e) => setOmEnabled(e.target.checked)}
                            className="rounded text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-[11px] font-bold text-orange-900">Actif</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-orange-800 uppercase mb-1">
                          Code Marchand OM / Numéro Pay
                        </label>
                        <input
                          type="text"
                          value={omMerchantCode}
                          onChange={(e) => setOmMerchantCode(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Coordonnées Bancaires */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-slate-700" />
                        <h4 className="font-bold text-slate-900 text-sm">Virement Bancaire UEMOA</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Établissement Bancaire
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Titulaire du Compte
                          </label>
                          <input
                            type="text"
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            IBAN / Numéro de Compte Complet
                          </label>
                          <input
                            type="text"
                            value={bankIban}
                            onChange={(e) => setBankIban(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Code BIC / SWIFT
                          </label>
                          <input
                            type="text"
                            value={bankSwift}
                            onChange={(e) => setBankSwift(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#111318] hover:bg-violet-600 text-white rounded-2xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les Coordonnées</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: RELANCES & MESSAGES */}
              {/* ============================================================= */}
              {activeTab === "reminders" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Configuration des Relances Automatisées
                      </h2>
                      <p className="text-xs text-slate-500">
                        Paramétrez vos modèles de messages WhatsApp et vos intervalles de notification.
                      </p>
                    </div>
                    <BellRing className="w-6 h-6 text-slate-400" />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveAll();
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-violet-950 text-sm">Activer les rappels proactifs</h4>
                        <p className="text-[11px] text-violet-700">
                          Affiche des boutons de rappel WhatsApp pré-remplis sur les factures proches de l&apos;échéance.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoRemindersEnabled}
                        onChange={(e) => setAutoRemindersEnabled(e.target.checked)}
                        className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Pré-relance avant échéance
                        </label>
                        <select
                          value={preDueDays}
                          onChange={(e) => setPreDueDays(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value={2}>J-2 (48h avant)</option>
                          <option value={3}>J-3 (Standard)</option>
                          <option value={5}>J-5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          1ère relance post-échéance
                        </label>
                        <select
                          value={reminder1Days}
                          onChange={(e) => setReminder1Days(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value={1}>J+1 après échéance</option>
                          <option value={2}>J+2</option>
                          <option value={3}>J+3</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          2ème relance ferme
                        </label>
                        <select
                          value={reminder2Days}
                          onChange={(e) => setReminder2Days(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value={7}>J+7 (1 semaine)</option>
                          <option value={10}>J+10</option>
                          <option value={14}>J+14 (2 semaines)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Modèle de Message WhatsApp par Défaut
                      </label>
                      <textarea
                        rows={4}
                        value={reminderWhatsappTemplate}
                        onChange={(e) => setReminderWhatsappTemplate(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Variables disponibles : &#123;client&#125;, &#123;facture&#125;, &#123;montant&#125;, &#123;echeance&#125;, &#123;wave&#125;
                      </span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#111318] hover:bg-violet-600 text-white rounded-2xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les Modèles</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 5: ÉQUIPE & ACCÈS */}
              {/* ============================================================= */}
              {activeTab === "team" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Membres de l&apos;Équipe & Permissions
                      </h2>
                      <p className="text-xs text-slate-500">
                        Gérez les accès de vos collaborateurs à l&apos;espace de facturation et de devis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#111318] hover:bg-violet-600 text-white text-xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Inviter un Membre</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-sm`}
                          >
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-950 text-xs">{member.name}</p>
                            <p className="text-[11px] text-slate-500">{member.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                            {member.role}
                          </span>
                          <span className="text-[11px] font-bold text-violet-600 hidden sm:inline">
                            {member.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 6: SÉCURITÉ & SAUVEGARDE */}
              {/* ============================================================= */}
              {activeTab === "security" && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 font-display">
                        Sécurité, Chiffrement & Sauvegardes
                      </h2>
                      <p className="text-xs text-slate-500">
                        Protection de vos données financières et options de réplication locale.
                      </p>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-emerald-950">Chiffrement AES-256 actif</h4>
                      </div>
                      <p className="text-emerald-800 text-[11px]">
                        Vos factures, devis et coordonnées clients sont sécurisés conformément aux normes bancaires UEMOA.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900">Exportation Globale des Données</h4>
                        <p className="text-[11px] text-slate-500">
                          Téléchargez une copie intégrale de vos factures ({invoices.length}), clients ({clients.length}) et devis ({quotes.length}).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="px-4 py-2 bg-slate-900 hover:bg-violet-600 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        Télécharger le Backup (.JSON)
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-rose-900">Réinitialiser les données locales</h4>
                        <p className="text-[11px] text-rose-700">
                          Efface les modifications personnalisées et recharge les données de démonstration officielles.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Réinitialiser l'espace avec les données de test par défaut ?")) {
                            localStorage.removeItem("izi_invoices");
                            localStorage.removeItem("izi_clients");
                            localStorage.removeItem("izi_quotes");
                            localStorage.removeItem("izi_settings");
                            window.location.reload();
                          }
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Inviter un Membre */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Inviter un Nouveau Collaborateur
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Seydou Traoré"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Email Professionnel *
                </label>
                <input
                  type="email"
                  required
                  placeholder="seydou@entreprise.ci"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Rôle & Droits
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
                >
                  <option value="Chargé Commercial">Chargé Commercial (Émission devis/factures)</option>
                  <option value="Comptable">Comptable (Suivi encaissements & relances)</option>
                  <option value="Administrateur">Administrateur (Gestion complète)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold bg-[#111318] hover:bg-violet-600"
                >
                  Envoyer l&apos;Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
