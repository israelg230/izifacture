# izi facture — Documentation & Guide de Référence Architecture

Ce document constitue la référence centrale pour le projet **izi facture**, une application SaaS moderne dédiée à la facturation, la gestion des devis, le suivi de trésorerie et la relation client pour entrepreneurs et PME en Afrique (zones UEMOA et CEMAC).

---

## 1. Ce que l'application fait

**izi facture** simplifie et professionnalise la gestion commerciale des indépendants, agences et entreprises d'Afrique francophone :
- **Facturation en FCFA (XOF)** : Génération rapide de factures conformes aux normes locales (sans centimes, TVA UEMOA standard 18%).
- **Support natif Mobile Money & Banque** : Wave, Orange Money, MTN MoMo, Moov Money et virement bancaire avec coordonnées automatiques.
- **Cycle Devis -> Facture** : Édition de devis professionnels avec conversion instantanée en facture en 1 clic.
- **Gestion des Acomptes & Récurrences** : Support des factures d'acompte (pourcentage ou montant fixe avec solde restant) et abonnements récurrents (mensuel, trimestriel, semestriel, annuel).
- **Export & Impression PDF instantanés** : Rendu papier fidèle au format A4 avec en-tête dynamique de l'entreprise, coordonnées légales (RCCM, NCC) et boutons d'impression/téléchargement direct.
- **Suivi des paiements & Trésorerie** : Enregistrement des règlements partiels ou totaux, alertes sur les échéances et factures en retard avec relance WhatsApp en 1 clic.

---

## 2. Toutes les fonctionnalités implémentées

### A. Tableau de Bord (`/`)
- Cartes statistiques dynamiques : Chiffre d'affaires encaissé, En attente, En retard, Total facturé.
- Focus sur la facture prioritaire du moment avec actions directes (Payer, Partager).
- Échéances imminentes et historique des derniers règlements Mobile Money.
- Tableau interactif des factures avec recherche loupe animée, filtrage par onglets et modal de création rapide.
- Skeleton loader fluide (transition de 1 à 1.2s au chargement et au rafraîchissement manuel).

### B. Création & Édition de Factures (`/factures/nouvelle`)
- Sélecteur de client avec création rapide en modal (nom, entreprise, ville, téléphone, email).
- Numérotation automatique continue (`FAC-2024-XXXX`).
- Sélecteur de dates avec calendrier déroulant personnalisé (Flat design avec navigation mensuelle, jours de semaine en français et sélection visuelle moderne).
- Gestion des lignes de facture : description, quantité, prix unitaire, calcul automatique HT/TVA 18%/TTC.
- Sélecteur de mode :
  - **Standard** : Facture de prestation classique.
  - **Acompte (Solde)** : Calcul automatique de l'acompte (en % ou montant fixe) et du solde exigible à livraison.
  - **Récurrente** : Périodicité (mensuelle, trimestrielle, annuelle) avec reconduction et badge visuel.
- **Aperçu papier en temps réel (`InvoicePreviewPaper`)** : Mise à jour instantanée à droite de l'écran avec coordonnées de l'entreprise synchronisées depuis les Paramètres.
- **Bouton « Télécharger la facture »** : Enregistre automatiquement la facture et lance l'impression/export PDF via `window.print()`.
- **Maintien d'identifiant et Anti-doublons** : Dès le premier enregistrement (Brouillon ou Téléchargement), l'identifiant est conservé (`currentInvoiceId` et URL `?edit=...`). Toute sauvegarde ultérieure effectue une mise à jour *in-place* sans jamais dupliquer la facture.

### C. Liste des Factures (`/factures`)
- Filtres rapides par statut (Toutes, Payées, Envoyées, En retard, Brouillons) avec badges de comptage.
- Recherche instantanée par nom de client ou numéro de facture.
- Tri multicritère (Date, Montant, Numéro).
- Actions rapides par ligne : Visualisation détaillée, Téléchargement direct, Marquage Payée, Suppression.

### D. Détail d'une Facture (`/factures/[id]`)
- Vue complète sur papier officiel A4 optimisé pour l'impression.
- Menu de changement de statut (Payée, Envoyée, En retard, Brouillon).
- Bouton de relance WhatsApp pré-rempli avec le montant en FCFA et l'échéance.
- Bouton de modification redirigeant vers l'éditeur pré-rempli.
- Modal de confirmation de suppression sécurisée.

### E. Gestion des Devis (`/devis`)
- Liste et aperçu papier des devis (`QuotePreviewPaper`).
- Conversion directe d'un devis accepté en facture en 1 clic (`convertQuoteToInvoice`).
- Filtres de statuts (Brouillon, Envoyé, Accepté, Refusé, Facturé).

### F. Annuaire Clients & Encaissements (`/clients`)
- Répertoire complet des clients avec fiche entreprise, ville, contact, email et historique d'achats.
- Modal d'enregistrement de paiement client (affectation automatique ou manuelle à une facture avec mise à jour du solde).
- Calcul du délai moyen de paiement et alertes de retard.

### G. Paramètres de l'Entreprise (`/parametres`)
- Synchronisation complète avec le Store (`companySettings`) et persistance `localStorage`.
- Configuration de l'identité : Nom commercial, Slogan, Forme juridique, RCCM, NCC, Ville, Pays, Téléphone, Email, Site web.
- Coordonnées Mobile Money par défaut (Wave, Orange, MTN, Moov) et IBAN/RIB bancaire.
- Les informations renseignées s'affichent automatiquement sur l'en-tête et le pied de page des factures et devis.

### H. Aide & Support (`/aide`)
- Accessible via l'icône d'aide située directement sous les paramètres dans la barre latérale.
- FAQ interactive (accordéons fluides sur la conformité UEMOA, les acomptes, les sauvegardes JSON).
- Liens de contact rapide par WhatsApp (+225) et Email d'assistance.

### I. Authentification & Connexion (`/connexion` & `/login`)
- Page moderne de connexion et d'inscription avec design glassmorphism, ambiances lumineuses et propositions de valeur de l'application.
- **Accès Rapide Démo (1 clic)** : Permet de tester instantanément la plateforme sans saisie ni confirmation de mot de passe.
- **Support Supabase Auth** : Authentification e-mail / mot de passe native avec Supabase.
- **Protection par `AuthGuard`** : Redirection automatique des utilisateurs non authentifiés vers `/connexion` et redirection vers `/` une fois connectés.
- **Menu Profil & Déconnexion** : Menu déroulant dans la `TopNav`, le tiroir `MobileNav` et icône de déconnexion dans la `SidebarRail`.

---

## 3. Structure des Fichiers

```text
izi facture/
├── app/                                 # Routes Next.js (App Router)
│   ├── layout.tsx                       # Layout racine avec polices, AuthProvider et AppProvider
│   ├── page.tsx                         # Tableau de bord principal
│   ├── globals.css                      # Styles globaux et variables de thème
│   ├── connexion/
│   │   └── page.tsx                     # Page de connexion & inscription
│   ├── login/
│   │   └── page.tsx                     # Redirection vers /connexion
│   ├── aide/
│   │   └── page.tsx                     # Page d'aide, support et FAQ
│   ├── support/
│   │   └── page.tsx                     # Redirection vers /aide
│   ├── factures/
│   │   ├── page.tsx                     # Liste et filtres des factures
│   │   ├── [id]/
│   │   │   └── page.tsx                 # Vue détaillée et actions d'une facture
│   │   └── nouvelle/
│   │       └── page.tsx                 # Éditeur de création / modification
│   ├── devis/
│   │   └── page.tsx                     # Gestion et conversion des devis
│   ├── clients/
│   │   └── page.tsx                     # Répertoire clients & encaissements
│   └── parametres/
│       └── page.tsx                     # Configuration de l'entreprise
├── components/                          # Composants d'interface modulaires
│   ├── auth/
│   │   └── AuthGuard.tsx                # Protection des routes et redirection automatique
│   ├── layout/
│   │   ├── SidebarRail.tsx              # Barre latérale desktop (icônes + infobulles + déconnexion)
│   │   ├── TopNav.tsx                   # Barre de navigation supérieure (menu profil + déconnexion)
│   │   └── MobileNav.tsx                # Barre fixe 5 colonnes et tiroir mobile (avec déconnexion)
│   ├── dashboard/
│   │   ├── StatCard.tsx                 # Cartes d'indicateurs financiers
│   │   ├── FocusInvoiceCard.tsx         # Carte de facture prioritaire
│   │   ├── UpcomingInvoicesCard.tsx     # Échéances imminentes
│   │   ├── RecentPaymentsCard.tsx       # Derniers encaissements Mobile Money
│   │   ├── InvoicesTable.tsx            # Tableau des factures sur l'accueil
│   │   ├── InvoiceDetailModal.tsx       # Modal de consultation rapide
│   │   ├── NewInvoiceModal.tsx          # Modal de création rapide
│   │   └── DashboardSkeleton.tsx        # Skeleton loaders animés
│   ├── invoices/
│   │   └── InvoicePreviewPaper.tsx      # Rendu officiel papier facture A4
│   ├── quotes/
│   │   └── QuotePreviewPaper.tsx        # Rendu officiel papier devis A4
│   └── ui/
│       ├── DatePicker.tsx               # Calendrier déroulant personnalisé Flat design
│       └── StatusBadge.tsx              # Badges de statut et badges Mobile Money
├── lib/                                 # Logique métier, types et stockage
│   ├── types.ts                         # Définitions TypeScript (Invoice, Client, etc.)
│   ├── money.ts                         # Formatage FCFA et dates françaises (formatDateFR)
│   ├── mock-data.ts                     # Données initiales et jeux de tests
│   ├── store-context.tsx                # Store React Context avec synchronisation Supabase & cache
│   ├── supabase/
│   │   └── client.ts                    # Client Supabase navigateur et serveur
│   └── services/
│       └── supabase-service.ts          # Mappings & opérations CRUD Supabase
├── tailwind.config.ts                   # Configuration thématique TailwindCSS
├── tsconfig.json                        # Configuration TypeScript
├── package.json                         # Dépendances et scripts de build
├── .env.local                           # Clés et URLs de connexion Supabase
└── GEMINI.md                            # Ce document de référence
```

---

## 4. Technologies Utilisées

| Technologie | Version / Rôle |
|---|---|
| **Next.js** | `14.2.x` (App Router, Server & Client Components) |
| **Supabase** | Backend PostgreSQL cloud, Auth & Stockage (`@supabase/supabase-js`) |
| **React** | `18.3.x` |
| **TypeScript** | `5.x` (Typage strict pour documents financiers) |
| **TailwindCSS** | `3.4.x` (Palette personnalisée, Flat design, utilitaires) |
| **Lucide React** | `0.453.x` (Iconographie vectorielle cohérente) |
| **Polices Google Fonts** | `Manrope` (Chiffres et grands titres) + `Inter` (Textes courants) |
| **date-fns** & natif | Manipulation et calcul de dates |
| **clsx / tailwind-merge** | Concaténation sécurisée de classes conditionnelles |

---

## 5. Décisions de Design & Expérience Utilisateur

1. **Direction Flat Design Doux** :
   - Fond global doux : `#faf9f6` / `bg-slate-50`.
   - Cartes en blanc pur `bg-white` avec bordures fines et nettes `border-slate-200` ou `border-slate-100`.
   - Zéro néomorphisme flou, aucun ombrage lourd ou dégradé agressif.

2. **Boutons d'Action & Interaction Dynamique** :
   - Couleur de base : Noir d'encre sombre `#111318`.
   - **Au survol (`hover`)** : Bascule dynamique vers le violet vif `hover:bg-violet-600 active:bg-violet-700` avec ombre douce `hover:shadow-md hover:shadow-violet-500/25`.
   - **Rotation d'icône `+`** : Rotation 90° (`group-hover:rotate-90 transition-transform duration-300`).
   - **Amorti tactile** : `active:scale-95` pour une sensation physique immédiate.

3. **Statuts & Badges en Puces Pill (`rounded-full`)** :
   - **Payée** : `bg-emerald-50 text-emerald-800 border-emerald-300`
   - **Envoyée** : `bg-amber-50 text-amber-800 border-amber-300`
   - **Brouillon** : `bg-slate-100 text-slate-700 border-slate-300`
   - **En retard** : `bg-rose-50 text-rose-800 border-rose-300` avec pastille pulsée `animate-ping`.

4. **Micro-Animations Subtiles** :
   - Survol des cartes : Légère élévation `hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`.
   - Focus de recherche : Loupe avec agrandissement et rotation de 12° (`group-focus-within:rotate-12 group-focus-within:scale-125`).
   - Cloche de notifications : Oscillation douce au survol (`hover:rotate-12`).

5. **Règles Métier Régionales UEMOA / CEMAC** :
   - **Aucun centime** : Les montants FCFA doivent toujours être arrondis à l'entier (`Math.round()`) via `formatFCFA()`.
   - **Dates au format français** : Toujours `DD/MM/YYYY` via `formatDateFR()`.
   - **TVA** : 18% par défaut.

---

## 6. Instructions pour un Futur Modèle d'IA

Lors de toute intervention future sur ce dépôt, respectez impérativement les règles suivantes :

1. **Règle d'Accueil Utilisateur** :
   - **Obligatoire sans exception** : Commencez toujours vos messages à l'utilisateur par la formule exacte :
     ```text
     bonjournou israel
     ```

2. **Idempotence & Intégrité des Données (Anti-doublons)** :
   - Lors de la modification ou ré-enregistrement d'une facture ou d'un devis, **ne jamais créer un second enregistrement**.
   - Toujours conserver l'identifiant (`id`) existant et passer par `updateInvoice` (ou `addInvoice` protégé par déduplication par `id` et `number`).
   - Conserver les fonctions `deduplicateInvoices` et `deduplicateQuotes` dans [lib/store-context.tsx](file:///c:/Users/GOUDAYI/izi%20facture/lib/store-context.tsx).

3. **Respect du Design System & Formats** :
   - Ne jamais introduire de centimes dans les montants FCFA.
   - Ne jamais réintroduire la mention « Brouillon » en filigrane sur le papier officiel de facture `InvoicePreviewPaper.tsx`.
   - Conserver la synchronisation des données de l'entreprise issues de `useApp().companySettings`.
   - Conserver les polices `Manrope` pour les montants et `Inter` pour les textes.

4. **Environnement d'Exécution sur Windows** :
   - Les scripts PowerShell `npm.ps1` sont désactivés par défaut sur cette machine.
   - Pour lancer le build ou démarrer le serveur de production, utiliser directement `node` :
     ```powershell
     node ./node_modules/next/dist/bin/next build
     node ./node_modules/next/dist/bin/next start
     ```
   - Ne jamais exécuter de commande `cd` (toujours spécifier l'argument `Cwd`).

5. **Checklist Globale de Conception & Gestion de Base de Données** :
   - **1 Concept = 1 Table** : Toute entité métier ayant un cycle de vie propre (`clients`, `invoices`, `quotes`, `payments`) possède sa table dédiée.
   - **Usage du JSONB** : Réservé uniquement aux listes imbriquées sans cycle de vie propre (ex: les `items` de facture).
   - **Immuabilité Financière (Grand Livre)** : Ne jamais écraser l'historique des règlements ; chaque versement génère une ligne datée dans `payments`.
   - **Table Dédiée Paramètres (`company_settings`)** : Isoler l'identité et les coordonnées de paiement dans une table singleton (`id = 'default'`).
   - **Typage Strict** : `NUMERIC(15, 2)` ou `BIGINT` pour les montants financiers (zéro `FLOAT`), `TIMESTAMPTZ` ou `DATE` pour les dates.
   - **Migrations Versionnées** : Conserver systématiquement les scripts SQL de création et mise à jour des tables.
   - **Sécurité RLS** : Activer `ENABLE ROW LEVEL SECURITY` dès la création de chaque table.
