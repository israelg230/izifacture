export type InvoiceStatus = "paid" | "sent" | "draft" | "overdue";

export type PaymentMethod =
  | "wave"
  | "orange_money"
  | "mtn_momo"
  | "moov_money"
  | "bank_transfer"
  | "cash"
  | "check";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // ex: 18 pour TVA 18%
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address?: string;
  avatarColor: string;
  initials: string;
}

export interface Invoice {
  id: string;
  number: string;
  client: Client;
  projectTitle: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  status: InvoiceStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  priority?: "Haute" | "Normale" | "Basse";
  items: InvoiceItem[];
  notes?: string;
  depositPercent?: number;
  depositAmount?: number;
  isDepositInvoice?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: "monthly" | "quarterly" | "biannual" | "yearly";
}

export interface CompanySettings {
  companyName: string;
  tradeName: string;
  rccm: string;
  ncc: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  quotePrefix: string;
  nextInvoiceNumber?: string;
  paymentTermsDays: number;
  legalNotice: string;
  waveEnabled: boolean;
  wavePhone: string;
  waveMerchantName: string;
  omEnabled: boolean;
  omMerchantCode: string;
  mtnEnabled: boolean;
  mtnPhone: string;
  bankName: string;
  bankAccountName: string;
  bankIban: string;
  bankSwift: string;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  percentage?: number;
  reference: string;
}

export interface DashboardStats {
  revenueThisMonth: {
    amount: number;
    changePercentage: number;
    invoicesCount: number;
  };
  pendingAmount: {
    amount: number;
    invoicesCount: number;
    nextDueDays: number;
  };
  overdueAmount: {
    amount: number;
    invoicesCount: number;
  };
  totalBilledYear: {
    amount: number;
    invoicesCount: number;
    recoveryRate: number;
  };
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "converted";

export interface Quote {
  id: string;
  number: string;
  client: Client;
  projectTitle: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  items: InvoiceItem[];
  notes?: string;
  paymentMethod: PaymentMethod;
  invoiceId?: string;
}

export interface ClientReminder {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  clientPhone: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceTotal: number;
  balanceDue: number;
  dueDate: string;
  daysLate: number;
  level: "pre_due" | "reminder_1" | "reminder_2" | "formal_notice";
  channel: "whatsapp" | "email" | "sms";
  status: "pending" | "sent" | "resolved";
  lastSentDate?: string;
  messagePreview: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role?: string;
  createdAt?: string;
}
