"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useApp } from "@/lib/store-context";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  BookOpen,
  FileText,
  CreditCard,
  ShieldCheck,
  Send,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  Zap,
} from "lucide-react";

export default function AideSupportPage() {
  const { showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket Form State
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Facturation & Devis");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // FAQ items
  const faqList = [
    {
      q: "Les factures et devis générés sont-ils conformes à la législation fiscale UEMOA / CEMAC ?",
      a: "Oui, à 100%. Toutes les factures émises sur izi facture intègrent l'ensemble des mentions fiscales obligatoires requises par la DGI (Direction Générale des Impôts) : mentions du RCCM, du numéro de compte contribuable (NCC / IFU / NIF), TVA standard à 18% ventilée séparément, montants arrêtés en Francs CFA sans décimales, et date limite de règlement claire.",
    },
    {
      q: "Pourquoi les montants sont-ils exclusivement en Francs CFA sans centimes ?",
      a: "Conformément aux directives monétaires de la BCEAO (Banque Centrale des États de l'Afrique de l'Ouest) et de la BEAC, le Franc CFA (XOF / XAF) est une monnaie fiduciaire dont l'unité transactionnelle minimale est de 1 FCFA. L'application applique donc un arrondi strict à l'entier (Math.round) pour garantir une conformité totale avec vos relevés bancaires et états financiers réels.",
    },
    {
      q: "Comment fonctionne l'encaissement via Mobile Money (Wave, Orange Money, MTN, Moov) ?",
      a: "Vous pouvez configurer vos numéros et codes marchands dans les Paramètres. Vos coordonnées de paiement sont automatiquement intégrées sur chaque document et bordereau de facture. Vos clients peuvent ainsi vous payer instantanément sans frais cachés, et vous confirmez l'encaissement en un clic dans la section Paiements.",
    },
    {
      q: "Comment fonctionne la relance WhatsApp en 1 clic ?",
      a: "Dans la sous-section 'Relances' de la page Clients ou directement sur la vue détail d'une facture, un bouton 'Relance WhatsApp' génère un message courtois, pré-rempli avec le nom de votre client, le numéro de facture, le montant exact dû et vos coordonnées de règlement. Un clic ouvre directement WhatsApp Web ou l'application mobile sans que vous n'ayez rien à ressaisir.",
    },
    {
      q: "Puis-je transformer un Devis validé en Facture sans tout retaper ?",
      a: "Absolument. Sur la page 'Devis', chaque proposition commerciale dispose d'un bouton 'Facturer / Convertir en Facture'. Dès qu'un client valide votre proposition, un clic génère automatiquement la facture officielle certifiée avec toutes les lignes, désignations et montants correspondants.",
    },
    {
      q: "Comment exporter mes données pour mon expert-comptable ?",
      a: "Rendez-vous dans les 'Paramètres', onglet 'Sécurité & Sauvegarde', puis cliquez sur 'Télécharger le Backup (.JSON)'. Vous pouvez également imprimer ou enregistrer en PDF propre n'importe quelle facture, devis ou rapport d'activité grâce au bouton d'impression intégré.",
    },
  ];

  const filteredFaqs = faqList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;

    setTicketSubmitted(true);
    showToast("Votre demande d'assistance a été transmise à notre équipe support !");
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketMessage("");
    }, 4000);
  };

  const whatsappSupportUrl = `https://wa.me/2250788451290?text=${encodeURIComponent(
    "Bonjour l'équipe Support izi facture, j'ai une question concernant l'utilisation de mon compte."
  )}`;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* 1. Desktop Left Sidebar */}
      <SidebarRail />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav activeTab="support" />
        <TopNav activeTab="support" />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] w-full mx-auto space-y-7 pb-28 sm:pb-32 lg:pb-12">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-2.5 py-0.5 rounded-full border border-violet-200">
                  Centre d&apos;Assistance & Documentation
                </span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-500 font-medium">Zone UEMOA / CEMAC</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display">
                Aide & Support Client
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Guides d&apos;utilisation, réponses à vos questions fiscales et assistance technique directe en Franc CFA.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold shrink-0 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Support Client En Ligne (Abidjan & Dakar)</span>
            </div>
          </div>

          {/* Search Bar for Help Topics */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
            <div className="relative group max-w-2xl mx-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une question, fiscalité TVA, Wave, devis, relance..."
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* 3 Contact Channels Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Channel 1: WhatsApp Support Direct */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Réponse sous 5 min
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  WhatsApp Support Direct
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Échangez en direct avec notre équipe d&apos;assistance pour toute question urgente ou blocage de facturation.
                </p>
                <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                  +225 07 88 45 12 90
                </p>
              </div>

              <a
                href={whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir WhatsApp</span>
              </a>
            </div>

            {/* Channel 2: Assistance Téléphonique */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Lun - Sam, 8h - 19h
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Assistance Téléphonique
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Conseillers clientèle disponibles pour vous accompagner dans la prise en main de l&apos;application.
                </p>
                <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                  +225 27 20 21 00 00
                </p>
              </div>

              <a
                href="tel:+2252720210000"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 active:scale-95"
              >
                <Phone className="w-4 h-4 text-violet-600" />
                <span>Appeler un Conseiller</span>
              </a>
            </div>

            {/* Channel 3: Email & Tickets */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Support Dédié
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Support par Email
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Idéal pour les questions comptables, intégrations logicielles ou questions sur la TVA UEMOA.
                </p>
                <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                  support@izifacture.com
                </p>
              </div>

              <a
                href="mailto:support@izifacture.com?subject=Demande%20Assistance%20izi%20facture"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 active:scale-95"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Écrire un Email</span>
              </a>
            </div>
          </div>

          {/* Quick Guides Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-950 font-display">
                  Guides & Tutoriels Rapides
                </h2>
                <p className="text-xs text-slate-500">
                  Maîtrisez les fonctionnalités clés de facturation et de trésorerie en quelques minutes.
                </p>
              </div>
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link
                href="/factures/nouvelle"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/50 border border-slate-200 hover:border-violet-300 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-2">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-violet-900 transition-colors">
                    Émettre sa 1ère Facture
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sélection du client, calcul automatique de la TVA 18% et génération immédiate.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-violet-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Créer facture <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/clients?tab=paiements"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-900 transition-colors">
                    Passerelles Mobile Money
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Configurer Wave & Orange Money pour être payé directement sur vos factures.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir passerelles <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/clients?tab=relances"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-900 transition-colors">
                    Relances WhatsApp
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Relancer un client en retard en 1 clic avec un message poli pré-rempli.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir relances <ArrowRight className="w-3 h-3" />
                </span>
              </Link>

              <Link
                href="/devis"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-sky-900 transition-colors">
                    Devis vers Facture
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Transformer un devis accepté en facture officielle en un clic sans ressaisie.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir les devis <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Dual Column: FAQ on Left & Ticket Form on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* FAQ Accordion (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 font-display">
                    Foire Aux Questions (FAQ)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Réponses aux questions les plus courantes des entrepreneurs d&apos;Afrique.
                  </p>
                </div>
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>

              <div className="divide-y divide-slate-100">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-violet-700 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-violet-600" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="mt-2.5 text-xs text-slate-600 leading-relaxed pr-4 animate-in fade-in">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="py-6 text-center text-xs text-slate-500">
                    Aucun résultat pour cette recherche. Contactez notre support direct.
                  </p>
                )}
              </div>
            </div>

            {/* Ticket Submission Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 font-display">
                    Poser une Question
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transmettez une demande d&apos;assistance à nos experts.
                  </p>
                </div>
                <LifeBuoy className="w-5 h-5 text-violet-600" />
              </div>

              {ticketSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-950">Message Transmis !</h4>
                  <p className="text-xs text-emerald-800">
                    Notre équipe vous répondra par email dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Votre Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Israel G."
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@entreprise.ci"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Catégorie de la Demande
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium"
                    >
                      <option value="Facturation & Devis">Facturation & Devis</option>
                      <option value="Mobile Money & Paiement">Mobile Money & Paiements</option>
                      <option value="Fiscalité & TVA 18%">Fiscalité & TVA 18%</option>
                      <option value="Relances Clients">Relances Clients</option>
                      <option value="Autre question">Autre question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Votre Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Détaillez votre question ou le problème rencontré..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer la Demande</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
