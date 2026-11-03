# izi facture — Facturation SaaS Moderne pour l'Afrique (UEMOA / CEMAC)

**izi facture** est une solution SaaS intuitive, rapide et moderne conçue pour simplifier la gestion commerciale, la facturation en FCFA (XOF), le suivi des devis et la relance des règlements Mobile Money pour les indépendants, agences et PME en Afrique francophone.

---

## ✨ Fonctionnalités Clés

- **💰 Facturation en FCFA (sans centimes)** : Calculs conformes aux normes fiscales locales avec TVA standard UEMOA à 18%.
- **📱 Support Natif Mobile Money & Banques** : Wave, Orange Money, MTN MoMo, Moov Money et virement bancaire avec coordonnées automatiques sur les documents.
- **🔄 Cycle Devis & Factures** : Création rapide de devis professionnels avec conversion instantanée en facture en 1 clic.
- **⚡ Suivi de Trésorerie en Temps Réel** : Tableau de bord dynamique alimenté en direct par Supabase PostgreSQL (chiffre d'affaires encaissé, factures en attente, relances).
- **📅 Filtre par Période** : Analyse instantanée des transactions par mois, trimestre, année ou date personnalisée.
- **🖨️ Export & Impression Papier A4** : Gabarits haute fidélité prêts pour impression et téléchargement PDF direct via `window.print()`.
- **💬 Relance WhatsApp en 1 Clic** : Messages de relance pré-remplis avec montants et échéances.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Base de données & Auth** : [Supabase](https://supabase.com/) (PostgreSQL cloud, Row Level Security)
- **Langage** : [TypeScript](https://www.typescriptlang.org/) (Typage strict pour documents financiers)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/) (Palette personnalisée, Flat design)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Polices** : Manrope & Inter

---

## 🚀 Démarrage Rapide

### 1. Cloner le dépôt
```bash
git clone https://github.com/isro007/izifacture.git
cd izifacture
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

### 4. Lancer en local
```bash
npm run dev
```
Accédez ensuite à [http://localhost:3000](http://localhost:3000).

---

## 📂 Architecture de la Base de Données

Les scripts SQL et migrations sont disponibles dans le dossier `supabase/migrations/` :
- `clients` : Répertoire client avec coordonnées et localisation UEMOA.
- `invoices` : Factures d'acompte, récurrentes ou standards avec items JSONB.
- `quotes` : Devis commerciaux avec statut de conversion.
- `payments` : Grand livre immuable des règlements Mobile Money et bancaires.
- `company_settings` : Singleton des paramètres de l'entreprise et coordonnées de paiement.

---

## 📄 Licence

Propriété de Afrik Innovations SARL. Tous droits réservés.
