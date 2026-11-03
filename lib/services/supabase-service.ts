import { supabase } from "@/lib/supabase/client";
import { Invoice, Client, Quote, Payment, CompanySettings } from "@/lib/types";

// ==================== COMPANY SETTINGS ====================

export function mapCompanySettingsFromDb(row: any): CompanySettings {
  return {
    companyName: row.company_name ?? "",
    tradeName: row.trade_name ?? "",
    rccm: row.rccm ?? "",
    ncc: row.ncc ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    country: row.country ?? "",
    website: row.website ?? "",
    defaultTaxRate: Number(row.default_tax_rate ?? 18),
    invoicePrefix: row.invoice_prefix ?? "FAC-2024-",
    quotePrefix: row.quote_prefix ?? "DEV-2024-",
    nextInvoiceNumber: row.next_invoice_number ?? "0043",
    paymentTermsDays: Number(row.payment_terms_days ?? 14),
    legalNotice: row.legal_notice ?? "",
    waveEnabled: Boolean(row.wave_enabled),
    wavePhone: row.wave_phone ?? "",
    waveMerchantName: row.wave_merchant_name ?? "",
    omEnabled: Boolean(row.om_enabled),
    omMerchantCode: row.om_merchant_code ?? "",
    mtnEnabled: Boolean(row.mtn_enabled),
    mtnPhone: row.mtn_phone ?? "",
    bankName: row.bank_name ?? "",
    bankAccountName: row.bank_account_name ?? "",
    bankIban: row.bank_iban ?? "",
    bankSwift: row.bank_swift ?? "",
  };
}

export function mapCompanySettingsToDb(settings: Partial<CompanySettings>) {
  const row: Record<string, any> = { id: "default", updated_at: new Date().toISOString() };
  if (settings.companyName !== undefined) row.company_name = settings.companyName;
  if (settings.tradeName !== undefined) row.trade_name = settings.tradeName;
  if (settings.rccm !== undefined) row.rccm = settings.rccm;
  if (settings.ncc !== undefined) row.ncc = settings.ncc;
  if (settings.email !== undefined) row.email = settings.email;
  if (settings.phone !== undefined) row.phone = settings.phone;
  if (settings.address !== undefined) row.address = settings.address;
  if (settings.city !== undefined) row.city = settings.city;
  if (settings.country !== undefined) row.country = settings.country;
  if (settings.website !== undefined) row.website = settings.website;
  if (settings.defaultTaxRate !== undefined) row.default_tax_rate = settings.defaultTaxRate;
  if (settings.invoicePrefix !== undefined) row.invoice_prefix = settings.invoicePrefix;
  if (settings.quotePrefix !== undefined) row.quote_prefix = settings.quotePrefix;
  if (settings.nextInvoiceNumber !== undefined) row.next_invoice_number = settings.nextInvoiceNumber;
  if (settings.paymentTermsDays !== undefined) row.payment_terms_days = settings.paymentTermsDays;
  if (settings.legalNotice !== undefined) row.legal_notice = settings.legalNotice;
  if (settings.waveEnabled !== undefined) row.wave_enabled = settings.waveEnabled;
  if (settings.wavePhone !== undefined) row.wave_phone = settings.wavePhone;
  if (settings.waveMerchantName !== undefined) row.wave_merchant_name = settings.waveMerchantName;
  if (settings.omEnabled !== undefined) row.om_enabled = settings.omEnabled;
  if (settings.omMerchantCode !== undefined) row.om_merchant_code = settings.omMerchantCode;
  if (settings.mtnEnabled !== undefined) row.mtn_enabled = settings.mtnEnabled;
  if (settings.mtnPhone !== undefined) row.mtn_phone = settings.mtnPhone;
  if (settings.bankName !== undefined) row.bank_name = settings.bankName;
  if (settings.bankAccountName !== undefined) row.bank_account_name = settings.bankAccountName;
  if (settings.bankIban !== undefined) row.bank_iban = settings.bankIban;
  if (settings.bankSwift !== undefined) row.bank_swift = settings.bankSwift;
  return row;
}

// ==================== CLIENTS ====================

export function mapClientFromDb(row: any): Client {
  return {
    id: row.id,
    name: row.name ?? "",
    companyName: row.company_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    city: row.city ?? "",
    country: row.country ?? "",
    address: row.address ?? "",
    avatarColor: row.avatar_color ?? "bg-indigo-500",
    initials: row.initials ?? (row.company_name || row.name || "CL").slice(0, 2).toUpperCase(),
  };
}

export function mapClientToDb(client: Client) {
  return {
    id: client.id,
    name: client.name,
    company_name: client.companyName,
    email: client.email,
    phone: client.phone,
    city: client.city,
    country: client.country,
    address: client.address || "",
    avatar_color: client.avatarColor || "bg-indigo-500",
    initials: client.initials || "",
    updated_at: new Date().toISOString(),
  };
}

// ==================== INVOICES ====================

export function mapInvoiceFromDb(row: any, clientsMap: Map<string, Client>): Invoice {
  const client: Client =
    row.client_data ||
    (row.client_id ? clientsMap.get(row.client_id) : null) || {
      id: row.client_id || "cli_unknown",
      name: "Client Inconnu",
      companyName: "Client",
      email: "",
      phone: "",
      city: "",
      country: "",
      avatarColor: "bg-slate-400",
      initials: "CL",
    };

  return {
    id: row.id,
    number: row.number,
    client,
    projectTitle: row.project_title,
    issueDate: typeof row.issue_date === "string" ? row.issue_date.split("T")[0] : row.issue_date,
    dueDate: typeof row.due_date === "string" ? row.due_date.split("T")[0] : row.due_date,
    status: row.status,
    subtotal: Number(row.subtotal),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    amountPaid: Number(row.amount_paid),
    balanceDue: Number(row.balance_due),
    paymentMethod: row.payment_method,
    priority: row.priority,
    notes: row.notes || "",
    depositPercent: row.deposit_percent ? Number(row.deposit_percent) : undefined,
    depositAmount: row.deposit_amount ? Number(row.deposit_amount) : undefined,
    isDepositInvoice: Boolean(row.is_deposit_invoice),
    isRecurring: Boolean(row.is_recurring),
    recurringFrequency: row.recurring_frequency,
    items: Array.isArray(row.items) ? row.items : [],
  };
}

export function mapInvoiceToDb(invoice: Invoice) {
  return {
    id: invoice.id,
    number: invoice.number,
    client_id: invoice.client?.id || null,
    client_data: invoice.client || null,
    project_title: invoice.projectTitle || "Prestation",
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    status: invoice.status,
    subtotal: invoice.subtotal || 0,
    tax_total: invoice.taxTotal || 0,
    total: invoice.total || 0,
    amount_paid: invoice.amountPaid || 0,
    balance_due: invoice.balanceDue || 0,
    payment_method: invoice.paymentMethod || "wave",
    priority: invoice.priority || "Normale",
    notes: invoice.notes || "",
    deposit_percent: invoice.depositPercent ?? null,
    deposit_amount: invoice.depositAmount ?? null,
    is_deposit_invoice: Boolean(invoice.isDepositInvoice),
    is_recurring: Boolean(invoice.isRecurring),
    recurring_frequency: invoice.recurringFrequency ?? null,
    items: invoice.items || [],
    updated_at: new Date().toISOString(),
  };
}

// ==================== QUOTES ====================

export function mapQuoteFromDb(row: any, clientsMap: Map<string, Client>): Quote {
  const client: Client =
    row.client_data ||
    (row.client_id ? clientsMap.get(row.client_id) : null) || {
      id: row.client_id || "cli_unknown",
      name: "Client Inconnu",
      companyName: "Client",
      email: "",
      phone: "",
      city: "",
      country: "",
      avatarColor: "bg-slate-400",
      initials: "CL",
    };

  return {
    id: row.id,
    number: row.number,
    client,
    projectTitle: row.project_title,
    date: typeof row.date === "string" ? row.date.split("T")[0] : row.date,
    validUntil: typeof row.valid_until === "string" ? row.valid_until.split("T")[0] : row.valid_until,
    status: row.status,
    subtotal: Number(row.subtotal),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    notes: row.notes || "",
    invoiceId: row.invoice_id || undefined,
    items: Array.isArray(row.items) ? row.items : [],
  };
}

export function mapQuoteToDb(quote: Quote) {
  return {
    id: quote.id,
    number: quote.number,
    client_id: quote.client?.id || null,
    client_data: quote.client || null,
    project_title: quote.projectTitle || "Devis",
    date: quote.date,
    valid_until: quote.validUntil,
    status: quote.status,
    subtotal: quote.subtotal || 0,
    tax_total: quote.taxTotal || 0,
    total: quote.total || 0,
    payment_method: quote.paymentMethod || "wave",
    notes: quote.notes || "",
    invoice_id: quote.invoiceId || null,
    items: quote.items || [],
    updated_at: new Date().toISOString(),
  };
}

// ==================== PAYMENTS ====================

export function mapPaymentFromDb(row: any): Payment {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    clientName: row.client_name,
    amount: Number(row.amount),
    method: row.method,
    date: typeof row.date === "string" ? row.date.split("T")[0] : row.date,
    percentage: row.percentage ? Number(row.percentage) : undefined,
    reference: row.reference || "",
  };
}

export function mapPaymentToDb(payment: Payment) {
  return {
    id: payment.id,
    invoice_number: payment.invoiceNumber,
    client_name: payment.clientName,
    amount: payment.amount,
    method: payment.method,
    date: payment.date,
    percentage: payment.percentage ?? null,
    reference: payment.reference || "",
  };
}

// ==================== REPOSITORIES / DATA SERVICES ====================

export const SupabaseService = {
  async fetchInitialData() {
    try {
      const [settingsRes, clientsRes, invoicesRes, quotesRes, paymentsRes] = await Promise.all([
        supabase.from("company_settings").select("*").limit(1).maybeSingle(),
        supabase.from("clients").select("*").order("created_at", { ascending: false }),
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("payments").select("*").order("date", { ascending: false }),
      ]);

      let settings: CompanySettings | null = null;
      if (settingsRes.data) {
        settings = mapCompanySettingsFromDb(settingsRes.data);
      }

      let clients: Client[] = [];
      const clientsMap = new Map<string, Client>();
      if (clientsRes.data) {
        clients = clientsRes.data.map(mapClientFromDb);
        clients.forEach((c) => clientsMap.set(c.id, c));
      }

      let invoices: Invoice[] = [];
      if (invoicesRes.data) {
        invoices = invoicesRes.data.map((row) => mapInvoiceFromDb(row, clientsMap));
      }

      let quotes: Quote[] = [];
      if (quotesRes.data) {
        quotes = quotesRes.data.map((row) => mapQuoteFromDb(row, clientsMap));
      }

      let payments: Payment[] = [];
      if (paymentsRes.data) {
        payments = paymentsRes.data.map(mapPaymentFromDb);
      }

      return {
        settings,
        clients,
        invoices,
        quotes,
        payments,
      };
    } catch (err) {
      console.error("Supabase fetchInitialData error:", err);
      return null;
    }
  },

  async upsertInvoice(invoice: Invoice): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapInvoiceToDb(invoice);
      const { error } = await supabase.from("invoices").upsert(dbRow, { onConflict: "id" });
      if (error) {
        console.error("Error upserting invoice in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception upserting invoice in Supabase:", err);
      return { success: false, error: err?.message || "Erreur de connexion Supabase" };
    }
  },

  async deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) {
        console.error("Error deleting invoice in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception deleting invoice in Supabase:", err);
      return { success: false, error: err?.message || "Erreur de suppression" };
    }
  },

  async updateInvoiceStatus(
    id: string,
    status: string,
    amountPaid: number,
    balanceDue: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("invoices")
        .update({
          status,
          amount_paid: amountPaid,
          balance_due: balanceDue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) {
        console.error("Error updating invoice status in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception updating invoice status in Supabase:", err);
      return { success: false, error: err?.message || "Erreur de mise à jour" };
    }
  },

  async upsertClient(client: Client): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapClientToDb(client);
      const { error } = await supabase.from("clients").upsert(dbRow, { onConflict: "id" });
      if (error) {
        console.error("Error upserting client in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception upserting client in Supabase:", err);
      return { success: false, error: err?.message || "Erreur d'enregistrement client" };
    }
  },

  async deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) {
        console.error("Error deleting client in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception deleting client in Supabase:", err);
      return { success: false, error: err?.message || "Erreur de suppression client" };
    }
  },

  async upsertQuote(quote: Quote): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapQuoteToDb(quote);
      const { error } = await supabase.from("quotes").upsert(dbRow, { onConflict: "id" });
      if (error) {
        console.error("Error upserting quote in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception upserting quote in Supabase:", err);
      return { success: false, error: err?.message || "Erreur d'enregistrement devis" };
    }
  },

  async deleteQuote(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) {
        console.error("Error deleting quote in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception deleting quote in Supabase:", err);
      return { success: false, error: err?.message || "Erreur de suppression devis" };
    }
  },

  async insertPayment(payment: Payment): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapPaymentToDb(payment);
      const { error } = await supabase.from("payments").upsert(dbRow, { onConflict: "id" });
      if (error) {
        console.error("Error inserting payment in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception inserting payment in Supabase:", err);
      return { success: false, error: err?.message || "Erreur d'enregistrement règlement" };
    }
  },

  async updateCompanySettings(
    settings: Partial<CompanySettings>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const dbRow = mapCompanySettingsToDb(settings);
      const { error } = await supabase.from("company_settings").upsert(dbRow, { onConflict: "id" });
      if (error) {
        console.error("Error updating company settings in Supabase:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("Exception updating company settings in Supabase:", err);
      return { success: false, error: err?.message || "Erreur mise à jour réglages" };
    }
  },
};
