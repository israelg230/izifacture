-- ==============================================================================
-- izi facture — Schéma PostgreSQL / Supabase
-- Script de migration initial complet (5 tables)
-- ==============================================================================

-- 1. Paramètres de l'entreprise (Singleton)
CREATE TABLE IF NOT EXISTS public.company_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT,
    trade_name TEXT,
    rccm TEXT,
    ncc TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    website TEXT,
    default_tax_rate NUMERIC DEFAULT 18,
    invoice_prefix TEXT DEFAULT 'FAC-2024-',
    quote_prefix TEXT DEFAULT 'DEV-2024-',
    next_invoice_number TEXT DEFAULT '0043',
    payment_terms_days INTEGER DEFAULT 14,
    legal_notice TEXT,
    wave_enabled BOOLEAN DEFAULT false,
    wave_phone TEXT,
    wave_merchant_name TEXT,
    om_enabled BOOLEAN DEFAULT false,
    om_merchant_code TEXT,
    mtn_enabled BOOLEAN DEFAULT false,
    mtn_phone TEXT,
    bank_name TEXT,
    bank_account_name TEXT,
    bank_iban TEXT,
    bank_swift TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Annuaire Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    country TEXT,
    address TEXT,
    avatar_color TEXT DEFAULT 'bg-indigo-500',
    initials TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Factures
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_data JSONB,
    project_title TEXT,
    issue_date DATE,
    due_date DATE,
    status TEXT NOT NULL,
    subtotal NUMERIC DEFAULT 0,
    tax_total NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    amount_paid NUMERIC DEFAULT 0,
    balance_due NUMERIC DEFAULT 0,
    payment_method TEXT DEFAULT 'wave',
    priority TEXT DEFAULT 'Normale',
    notes TEXT,
    deposit_percent NUMERIC,
    deposit_amount NUMERIC,
    is_deposit_invoice BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Devis
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    client_id TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
    client_data JSONB,
    project_title TEXT,
    date DATE,
    valid_until DATE,
    status TEXT NOT NULL,
    subtotal NUMERIC DEFAULT 0,
    tax_total NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    payment_method TEXT DEFAULT 'wave',
    notes TEXT,
    invoice_id TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. Règlements / Paiements (Grand Livre des encaissements)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    invoice_number TEXT,
    client_name TEXT,
    amount NUMERIC DEFAULT 0,
    method TEXT,
    date DATE,
    percentage NUMERIC,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Activation du Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS permissives par défaut (accès public pour l'application avec clé anon)
CREATE POLICY "Allow all on company_settings" ON public.company_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on quotes" ON public.quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

