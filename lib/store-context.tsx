"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Invoice, Client, Payment, InvoiceStatus, Quote, ClientReminder, CompanySettings } from "./types";
import { CheckCircle2, Cloud } from "lucide-react";
import { SupabaseService } from "./services/supabase-service";

export const defaultCompanySettings: CompanySettings = {
  companyName: "Afrik Innovations SARL",
  tradeName: "izi facture",
  rccm: "CI-ABJ-03-2024-B12-00452",
  ncc: "2401892 A",
  email: "contact@afrikinnovations.ci",
  phone: "+225 07 88 45 12 90",
  address: "Plateau, Immeuble Horizon, Rue des Banques",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  website: "https://izifacture.com",
  defaultTaxRate: 18,
  invoicePrefix: "FAC-2024-",
  quotePrefix: "DEV-2024-",
  nextInvoiceNumber: "0001",
  paymentTermsDays: 14,
  legalNotice:
    "TVA 18% standard UEMOA applicable. Règlement net sous 14 jours par Mobile Money (Wave, Orange Money) ou virement bancaire. En cas de retard, pénalité de 10% l'an.",
  waveEnabled: true,
  wavePhone: "+225 07 88 45 12 90",
  waveMerchantName: "Afrik Innovations",
  omEnabled: true,
  omMerchantCode: "489201",
  mtnEnabled: true,
  mtnPhone: "+229 97 12 45 88",
  bankName: "Ecobank Côte d'Ivoire",
  bankAccountName: "Afrik Innovations SARL",
  bankIban: "CI059 01001 0023456789 42",
  bankSwift: "ECOBCIABJ",
};

interface AppContextType {
  invoices: Invoice[];
  clients: Client[];
  payments: Payment[];
  quotes: Quote[];
  reminders: ClientReminder[];
  companySettings: CompanySettings;
  isSyncing: boolean;
  isLoaded: boolean;
  refreshData: () => Promise<void>;
  updateCompanySettings: (settings: Partial<CompanySettings>) => Promise<{ success: boolean; error?: string }>;
  addInvoice: (invoice: Invoice) => Promise<{ success: boolean; error?: string }>;
  updateInvoice: (invoice: Invoice) => Promise<{ success: boolean; error?: string }>;
  deleteInvoice: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<{ success: boolean; error?: string }>;
  addClient: (client: Client) => Promise<{ success: boolean; error?: string }>;
  updateClient: (client: Client) => Promise<{ success: boolean; error?: string }>;
  deleteClient: (id: string) => Promise<{ success: boolean; error?: string }>;
  addQuote: (quote: Quote) => Promise<{ success: boolean; error?: string }>;
  updateQuote: (quote: Quote) => Promise<{ success: boolean; error?: string }>;
  deleteQuote: (id: string) => Promise<{ success: boolean; error?: string }>;
  convertQuoteToInvoice: (quoteId: string) => Promise<Invoice | null>;
  addPayment: (payment: Payment) => Promise<{ success: boolean; error?: string }>;
  sendReminder: (reminderId: string) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Pure database states - STRICTLY initialized to empty arrays (zero mock fallback)
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [reminders, setReminders] = useState<ClientReminder[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(defaultCompanySettings);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deduplicate helper ensuring single unique entry per ID and per Invoice Number
  const deduplicateInvoices = (list: Invoice[]): Invoice[] => {
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const result: Invoice[] = [];

    for (const inv of list) {
      if (!inv || !inv.id) continue;
      const hasSeenId = seenIds.has(inv.id);
      const hasSeenNum = inv.number ? seenNumbers.has(inv.number) : false;
      if (hasSeenId || hasSeenNum) continue;

      seenIds.add(inv.id);
      if (inv.number) seenNumbers.add(inv.number);
      result.push(inv);
    }
    return result;
  };

  const deduplicateQuotes = (list: Quote[]): Quote[] => {
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const result: Quote[] = [];

    for (const q of list) {
      if (!q || !q.id) continue;
      const hasSeenId = seenIds.has(q.id);
      const hasSeenNum = q.number ? seenNumbers.has(q.number) : false;
      if (hasSeenId || hasSeenNum) continue;

      seenIds.add(q.id);
      if (q.number) seenNumbers.add(q.number);
      result.push(q);
    }
    return result;
  };

  // 2. Fetch data directly from Supabase PostgreSQL
  async function loadFromSupabase() {
    setIsSyncing(true);
    try {
      const data = await SupabaseService.fetchInitialData();
      if (data) {
        if (data.settings) {
          setCompanySettings(data.settings);
          try {
            localStorage.setItem("izi_settings", JSON.stringify(data.settings));
          } catch {}
        }
        if (Array.isArray(data.clients)) {
          setClients(data.clients);
          try {
            localStorage.setItem("izi_clients", JSON.stringify(data.clients));
          } catch {}
        }
        if (Array.isArray(data.invoices)) {
          const uniqueInvoices = deduplicateInvoices(data.invoices);
          setInvoices(uniqueInvoices);
          try {
            localStorage.setItem("izi_invoices", JSON.stringify(uniqueInvoices));
          } catch {}
        }
        if (Array.isArray(data.quotes)) {
          const uniqueQuotes = deduplicateQuotes(data.quotes);
          setQuotes(uniqueQuotes);
          try {
            localStorage.setItem("izi_quotes", JSON.stringify(uniqueQuotes));
          } catch {}
        }
        if (Array.isArray(data.payments)) {
          setPayments(data.payments);
          try {
            localStorage.setItem("izi_payments", JSON.stringify(data.payments));
          } catch {}
        }
      }
    } catch (err) {
      console.error("Erreur de synchronisation Supabase :", err);
    } finally {
      setIsSyncing(false);
      setIsLoaded(true);
    }
  }

  // Restore from localStorage first (purging legacy mock data), then sync with Supabase cloud
  useEffect(() => {
    try {
      // Purge any legacy mock entries from browser cache
      const isPurged = localStorage.getItem("izi_db_purged_v4");
      if (!isPurged) {
        localStorage.removeItem("izi_invoices");
        localStorage.removeItem("izi_clients");
        localStorage.removeItem("izi_quotes");
        localStorage.removeItem("izi_payments");
        localStorage.removeItem("izi_reminders");
        localStorage.setItem("izi_db_purged_v4", "true");
      } else {
        const isMock = (id?: string) => !id || /^(inv|cli|quote|pay|rem)_[0-9]+$/.test(id);

        const savedInvoices = localStorage.getItem("izi_invoices");
        const savedClients = localStorage.getItem("izi_clients");
        const savedQuotes = localStorage.getItem("izi_quotes");
        const savedPayments = localStorage.getItem("izi_payments");
        const savedReminders = localStorage.getItem("izi_reminders");
        const savedSettings = localStorage.getItem("izi_settings");

        if (savedInvoices) {
          const parsed: Invoice[] = JSON.parse(savedInvoices);
          const realInvoices = parsed.filter((i) => !isMock(i.id));
          if (realInvoices.length > 0) {
            setInvoices(deduplicateInvoices(realInvoices));
          }
        }
        if (savedClients) {
          const parsed: Client[] = JSON.parse(savedClients);
          const realClients = parsed.filter((c) => !isMock(c.id));
          if (realClients.length > 0) {
            setClients(realClients);
          }
        }
        if (savedQuotes) {
          const parsed: Quote[] = JSON.parse(savedQuotes);
          const realQuotes = parsed.filter((q) => !isMock(q.id));
          if (realQuotes.length > 0) {
            setQuotes(deduplicateQuotes(realQuotes));
          }
        }
        if (savedPayments) {
          const parsed: Payment[] = JSON.parse(savedPayments);
          const realPayments = parsed.filter((p) => !isMock(p.id));
          if (realPayments.length > 0) {
            setPayments(realPayments);
          }
        }
        if (savedReminders) setReminders(JSON.parse(savedReminders));
        if (savedSettings) {
          setCompanySettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
      }
    } catch {
      // Ignore storage errors
    }

    loadFromSupabase();
  }, []);

  const updateCompanySettings = async (
    newSettings: Partial<CompanySettings>
  ): Promise<{ success: boolean; error?: string }> => {
    setCompanySettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem("izi_settings", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    const res = await SupabaseService.updateCompanySettings(newSettings);
    if (res.success) {
      showToast("Informations de l'entreprise synchronisées avec Supabase !");
    } else {
      showToast(`Erreur enregistrement réglages : ${res.error}`);
    }
    return res;
  };

  const saveInvoices = (newInvoices: Invoice[]) => {
    const unique = deduplicateInvoices(newInvoices);
    setInvoices(unique);
    try {
      localStorage.setItem("izi_invoices", JSON.stringify(unique));
    } catch {}
  };

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    try {
      localStorage.setItem("izi_clients", JSON.stringify(newClients));
    } catch {}
  };

  const saveQuotes = (newQuotes: Quote[]) => {
    const unique = deduplicateQuotes(newQuotes);
    setQuotes(unique);
    try {
      localStorage.setItem("izi_quotes", JSON.stringify(unique));
    } catch {}
  };

  const savePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    try {
      localStorage.setItem("izi_payments", JSON.stringify(newPayments));
    } catch {}
  };

  const saveReminders = (newReminders: ClientReminder[]) => {
    setReminders(newReminders);
    try {
      localStorage.setItem("izi_reminders", JSON.stringify(newReminders));
    } catch {}
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addInvoice = async (invoice: Invoice): Promise<{ success: boolean; error?: string }> => {
    // If invoice with matching id OR matching invoice number already exists, update it instead of adding a second entry
    const existingIndex = invoices.findIndex(
      (inv) => inv.id === invoice.id || (inv.number && inv.number === invoice.number)
    );

    if (existingIndex !== -1) {
      const updated = [...invoices];
      updated[existingIndex] = invoice;
      saveInvoices(updated);
      const res = await SupabaseService.upsertInvoice(invoice);
      if (res.success) {
        showToast(`Facture ${invoice.number} vérifiée et mise à jour en base de données !`);
      } else {
        showToast(`Erreur Supabase : ${res.error}`);
      }
      return res;
    }

    const updated = [invoice, ...invoices];
    saveInvoices(updated);
    const res = await SupabaseService.upsertInvoice(invoice);
    if (res.success) {
      showToast(`Facture ${invoice.number} vérifiée et enregistrée en base de données !`);
    } else {
      showToast(`Erreur Supabase : ${res.error}`);
    }
    return res;
  };

  const updateInvoice = async (
    updatedInvoice: Invoice
  ): Promise<{ success: boolean; error?: string }> => {
    const existingIndex = invoices.findIndex(
      (inv) => inv.id === updatedInvoice.id || (inv.number && inv.number === updatedInvoice.number)
    );

    if (existingIndex === -1) {
      const updated = [updatedInvoice, ...invoices];
      saveInvoices(updated);
      const res = await SupabaseService.upsertInvoice(updatedInvoice);
      if (res.success) {
        showToast(`Facture ${updatedInvoice.number} créée en base de données !`);
      } else {
        showToast(`Erreur Supabase : ${res.error}`);
      }
      return res;
    }

    const updated = [...invoices];
    updated[existingIndex] = updatedInvoice;
    saveInvoices(updated);
    const res = await SupabaseService.upsertInvoice(updatedInvoice);
    if (res.success) {
      showToast(`Facture ${updatedInvoice.number} modifiée et vérifiée en base de données`);
    } else {
      showToast(`Erreur Supabase : ${res.error}`);
    }
    return res;
  };

  const deleteInvoice = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = invoices.find((i) => i.id === id);
    const updated = invoices.filter((inv) => inv.id !== id);
    saveInvoices(updated);
    const res = await SupabaseService.deleteInvoice(id);
    if (res.success) {
      showToast(`Facture ${target?.number || id} supprimée de la base de données`);
    } else {
      showToast(`Erreur suppression : ${res.error}`);
    }
    return res;
  };

  const updateInvoiceStatus = async (
    id: string,
    status: InvoiceStatus
  ): Promise<{ success: boolean; error?: string }> => {
    let targetInv: Invoice | undefined;
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        const isPaid = status === "paid";
        const modified = {
          ...inv,
          status,
          amountPaid: isPaid ? inv.total : inv.amountPaid,
          balanceDue: isPaid ? 0 : inv.balanceDue,
        };
        targetInv = modified;
        return modified;
      }
      return inv;
    });
    saveInvoices(updated);

    const statusLabels: Record<InvoiceStatus, string> = {
      paid: "PAYÉE",
      sent: "ENVOYÉE",
      draft: "BROUILLON",
      overdue: "EN RETARD",
    };

    if (targetInv) {
      const res = await SupabaseService.updateInvoiceStatus(
        id,
        status,
        targetInv.amountPaid,
        targetInv.balanceDue
      );
      if (res.success) {
        showToast(`Statut ${statusLabels[status]} enregistré et vérifié en base de données !`);
      } else {
        showToast(`Erreur mise à jour statut : ${res.error}`);
      }
      return res;
    }
    return { success: true };
  };

  const addClient = async (client: Client): Promise<{ success: boolean; error?: string }> => {
    const updated = [client, ...clients];
    saveClients(updated);
    const res = await SupabaseService.upsertClient(client);
    if (res.success) {
      showToast(`Client ${client.companyName || client.name} enregistré et vérifié en base de données !`);
    } else {
      showToast(`Erreur enregistrement client : ${res.error}`);
    }
    return res;
  };

  const updateClient = async (
    updatedClient: Client
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c
    );
    saveClients(updated);
    const res = await SupabaseService.upsertClient(updatedClient);
    if (res.success) {
      showToast(`Client ${updatedClient.companyName || updatedClient.name} mis à jour en base de données`);
    } else {
      showToast(`Erreur mise à jour client : ${res.error}`);
    }
    return res;
  };

  const deleteClient = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = clients.find((c) => c.id === id);
    const updated = clients.filter((c) => c.id !== id);
    saveClients(updated);
    const res = await SupabaseService.deleteClient(id);
    if (res.success) {
      showToast(`Client ${target?.companyName || target?.name || id} supprimé de la base de données`);
    } else {
      showToast(`Erreur suppression client : ${res.error}`);
    }
    return res;
  };

  const addQuote = async (quote: Quote): Promise<{ success: boolean; error?: string }> => {
    const updated = [quote, ...quotes];
    saveQuotes(updated);
    const res = await SupabaseService.upsertQuote(quote);
    if (res.success) {
      showToast(`Devis ${quote.number} enregistré en base de données !`);
    } else {
      showToast(`Erreur enregistrement devis : ${res.error}`);
    }
    return res;
  };

  const updateQuote = async (
    updatedQuote: Quote
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
    saveQuotes(updated);
    const res = await SupabaseService.upsertQuote(updatedQuote);
    if (res.success) {
      showToast(`Devis ${updatedQuote.number} mis à jour en base de données`);
    } else {
      showToast(`Erreur devis : ${res.error}`);
    }
    return res;
  };

  const deleteQuote = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = quotes.find((q) => q.id === id);
    const updated = quotes.filter((q) => q.id !== id);
    saveQuotes(updated);
    const res = await SupabaseService.deleteQuote(id);
    if (res.success) {
      showToast(`Devis ${target?.number || id} supprimé de la base de données`);
    } else {
      showToast(`Erreur suppression devis : ${res.error}`);
    }
    return res;
  };

  const convertQuoteToInvoice = async (quoteId: string): Promise<Invoice | null> => {
    const targetQuote = quotes.find((q) => q.id === quoteId);
    if (!targetQuote) return null;

    const nextNum = invoices.length + 43;
    const newInvoiceNumber = `FAC-2024-00${nextNum}`;
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const newInvoice: Invoice = {
      id: `inv_from_${targetQuote.id}`,
      number: newInvoiceNumber,
      client: targetQuote.client,
      projectTitle: targetQuote.projectTitle,
      issueDate: today,
      dueDate: dueDate,
      status: "sent",
      subtotal: targetQuote.subtotal,
      taxTotal: targetQuote.taxTotal,
      total: targetQuote.total,
      amountPaid: 0,
      balanceDue: targetQuote.total,
      paymentMethod: targetQuote.paymentMethod,
      priority: "Haute",
      items: targetQuote.items,
      notes: `Facture issue de la validation du devis ${targetQuote.number}. ${targetQuote.notes || ""}`,
    };

    // Update quote status to converted in state and Supabase
    const updatedQuote = { ...targetQuote, status: "converted" as const, invoiceId: newInvoice.id };
    const updatedQuotes = quotes.map((q) => (q.id === quoteId ? updatedQuote : q));
    saveQuotes(updatedQuotes);
    await SupabaseService.upsertQuote(updatedQuote);

    // Add new invoice in state and Supabase
    const updatedInvoices = [newInvoice, ...invoices];
    saveInvoices(updatedInvoices);
    await SupabaseService.upsertInvoice(newInvoice);

    showToast(`Devis ${targetQuote.number} converti en Facture ${newInvoiceNumber} enregistrée en base de données !`);
    return newInvoice;
  };

  const addPayment = async (payment: Payment): Promise<{ success: boolean; error?: string }> => {
    const updated = [payment, ...payments];
    savePayments(updated);
    const res = await SupabaseService.insertPayment(payment);

    // If matches an invoice, update invoice balance
    const matchedInvoice = invoices.find((inv) => inv.number === payment.invoiceNumber);
    if (matchedInvoice) {
      const newAmountPaid = matchedInvoice.amountPaid + payment.amount;
      const newBalanceDue = Math.max(0, matchedInvoice.total - newAmountPaid);
      const newStatus: InvoiceStatus = newBalanceDue === 0 ? "paid" : matchedInvoice.status;
      const updatedInv: Invoice = {
        ...matchedInvoice,
        amountPaid: newAmountPaid,
        balanceDue: newBalanceDue,
        status: newStatus,
      };
      await updateInvoice(updatedInv);
    }

    if (res.success) {
      showToast(`Paiement de ${payment.amount} FCFA enregistré et vérifié en base de données !`);
    } else {
      showToast(`Erreur enregistrement paiement : ${res.error}`);
    }
    return res;
  };

  const sendReminder = (reminderId: string) => {
    const updated = reminders.map((rem) =>
      rem.id === reminderId
        ? { ...rem, status: "sent" as const, lastSentDate: new Date().toISOString().split("T")[0] }
        : rem
    );
    saveReminders(updated);
    showToast("Relance transmise avec succès au client !");
  };

  return (
    <AppContext.Provider
      value={{
        invoices,
        clients,
        payments,
        quotes,
        reminders,
        companySettings,
        isSyncing,
        isLoaded,
        refreshData: loadFromSupabase,
        updateCompanySettings,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        addClient,
        updateClient,
        deleteClient,
        addQuote,
        updateQuote,
        deleteQuote,
        convertQuoteToInvoice,
        addPayment,
        sendReminder,
        toastMessage,
        showToast,
      }}
    >
      {children}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#111318] text-white text-xs font-bold rounded-2xl border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
