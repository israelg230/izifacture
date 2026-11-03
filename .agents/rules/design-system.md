# Design System & Directives UI — izi facture

Ce document définit les règles de conception et d'implémentation obligatoires pour toutes les pages actuelles et futures de l'application **izi facture** (SaaS de facturation pour entrepreneurs africains — Zone UEMOA / CEMAC).

---

## 1. Identité & Règles Métier

- **Produit** : SaaS de facturation moderne pour entrepreneurs d'Afrique francophone (Côte d'Ivoire, Sénégal, Bénin, Cameroun, Togo, Burkina Faso, etc.).
- **Devise obligatoire** : Franc CFA (`FCFA` / `XOF`).
  - Aucun centime : utiliser `Math.round()`.
  - Formatage standardisé obligatoire via `formatFCFA(amount)` de `@/lib/money`.
  - Exemple : `1 250 000 FCFA` (espaces insécables).
- **Format des dates** : `DD/MM/YYYY` via `formatDateFR(dateStr)`. Exemple : `26/10/2024`.
- **Régime fiscal** : TVA standard à 18% (Zone UEMOA). Calcul automatique : `subtotalHT * 0.18 = taxTotal`, `subtotalHT + taxTotal = totalTTC`.

---

## 2. Direction Artistique : Flat Design & Finition Dribbble

Toutes les interfaces doivent arborer un **Flat Design rigoureux, épuré et moderne** :
- **Fonds & Toiles** : Fond de page crème/gris ultra-doux (`bg-[#faf9f6]` ou `bg-slate-50`). Cartes et conteneurs en blanc pur (`bg-white`).
- **Bordures nettes** : Pas d'ombres lourdes ou floues par défaut. Séparateurs et contours fins : `border border-slate-200` ou `border-slate-100`.
- **Typographie** :
  - **Titres & Métriques financières** : Police `Manrope` (`font-display font-light` ou `font-medium tracking-tight text-slate-950`).
  - **Textes, tableaux et labels** : Police `Inter` (`font-sans text-slate-600` ou `text-slate-900 font-bold`).
- **Rayons de courbure (Border Radius)** :
  - Grandes cartes : `rounded-3xl` (`1.5rem`).
  - Boutons d'action et modales : `rounded-2xl` (`1.25rem`).
  - Onglets, puces de statut, badges et pilules : `rounded-full` (`9999px`).

---

## 3. Palette de Couleurs & Tokens

```ts
// Nuances principales
Ink Black (Primaire sombre) : #111318  // Boutons principaux, onglets actifs, barres
Brand Violet (Accent vif)   : #7c3aed / #635bff (violet-600) // Hover d'action, sélections, liens
Surface Canvas              : #faf9f6 / #f8fafc (slate-50)
Card White                  : #ffffff
Border Default              : #e2e8f0 (slate-200)
Border Subtle               : #f1f5f9 (slate-100)
```

### Statuts des Factures (Badges en Pilules `rounded-full`)
Les statuts doivent obligatoirement utiliser le composant `@/components/ui/StatusBadge` :
- **Payée (`paid`)** : Fond `bg-emerald-50`, texte `text-emerald-800`, bordure `border-emerald-300`, point `bg-emerald-600`.
- **Envoyée (`sent`)** : Fond `bg-amber-50`, texte `text-amber-800`, bordure `border-amber-300`, point `bg-amber-500`.
- **Brouillon (`draft`)** : Fond `bg-slate-100`, texte `text-slate-700`, bordure `border-slate-300`, point `bg-slate-500`.
- **En retard (`overdue`)** : Fond `bg-rose-50`, texte `text-rose-800`, bordure `border-rose-300`, point `bg-rose-600` + **effet radar pulsé `animate-ping`**.

### Méthodes de Paiement (Mobile Money Africain)
- **Wave** : `bg-sky-50 text-sky-800 border-sky-300` (point cyan).
- **Orange Money** : `bg-orange-50 text-orange-900 border-orange-300` (point orange).
- **MTN MoMo** : `bg-yellow-50 text-yellow-900 border-yellow-300` (point jaune d'or).
- **Moov Money** : `bg-blue-50 text-blue-900 border-blue-300` (point bleu).
- **Virement Bancaire** : `bg-slate-50 text-slate-800 border-slate-300` (point ardoise).

---

## 4. Règle Majeure des Boutons d'Action & CTA

Tout bouton d'action principal (ex: "Nouvelle facture", "Créer un devis", "Ajouter un client", "Encaisser") doit **obligatoirement** respecter ce comportement :
- **État par défaut** : Fond sombre `#111318`, texte blanc, bordure transparente, ombre légère `shadow-sm`.
- **Survol (`hover`)** : Bascule dynamique vers le violet vif de marque `hover:bg-violet-600 active:bg-violet-700`, avec lueur violette douce `hover:shadow-md hover:shadow-violet-500/25`.
- **Micro-animation de l'icône** : L'icône `+` pivote de 90° au survol (`group-hover:rotate-90 transition-transform duration-300`).
- **Amorti tactile au clic** : `active:scale-95` ou `active:scale-[0.98]`.

```tsx
<button className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-[0.98] transition-all duration-200">
  <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
  <span>Nouvelle facture</span>
</button>
```

---

## 5. Micro-Animations et Interactions Obligatoires

Chaque page doit donner une sensation vivante et fluide grâce à des micro-animations subtiles :
1. **Élévation de carte au survol** :
   ```tsx
   className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
   ```
2. **Translation de flèche diagonale** (`ArrowUpRight`) :
   ```tsx
   <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
   ```
3. **Champs de recherche avec Loupe animée au focus** :
   ```tsx
   <div className="relative group">
     <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out group-focus-within:text-violet-600 group-focus-within:scale-125 group-focus-within:rotate-12 group-focus-within:-translate-y-1/2" />
     <input className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:border-violet-500 transition-colors" />
   </div>
   ```
4. **Survol des lignes de tableau** :
   - Fond avec léger voile violet : `hover:bg-violet-50/25 transition-all duration-150`.
   - Rebond d'icône d'action (Voir, Télécharger) : `hover:scale-110 active:scale-90 transition-all duration-150`.
5. **Cloche de notification** :
   - Oscillation au survol : `group-hover:rotate-12 transition-transform duration-200`.
   - Pastille rouge avec onde radar pulsée : `<span className="animate-ping ... bg-rose-400" />`.
6. **Amorti tactile général** :
   - Tout bouton de filtre, onglet ou puce de sélection doit inclure `hover:scale-105 active:scale-95 transition-all duration-150`.

---

## 6. Structure de Page & Navigation Réutilisable

Toute nouvelle page de l'application doit réutiliser la même structure de mise en page :
1. **SidebarRail** latérale gauche sur Desktop (`w-[72px] hidden lg:flex`).
2. **TopNav** supérieure avec logo, devise active, recherche animée, cloche de notification et profil utilisateur.
3. **MobileNav** réactive avec :
   - En-tête mobile collant (`sticky top-0 lg:hidden`).
   - Drawer coulissant de navigation complète.
   - Barre de navigation basse fixée en **grille stricte de 5 colonnes** (`grid grid-cols-5`) avec le bouton central `+` surélevé (`-mt-4 rounded-full ring-4 ring-white`).
4. **Zone de contenu principal** :
   - Conteneur centré : `max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-28 sm:pb-32 lg:pb-12`.
   - En-tête de section avec sous-onglets en pilules (`rounded-full border border-slate-200 p-1 bg-white`).
   - Titre de page en grand format épuré (`text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-950 font-display`).
   - Bouton **"Actualiser"** avec état de chargement et Skeleton loader.

---

## 7. Gestion des Skeleton Loaders

- Ne jamais laisser une page bloquée sur le skeleton : l'état `isLoading` doit être piloté avec une transition garantie vers les données réelles (1 à 1.2s).
- Afficher un toast de confirmation lors du rafraîchissement manuel : `showToast("Données actualisées avec succès")`.
- Structure du Skeleton : utiliser `@/components/ui/Skeleton` avec pulsation fluide (`animate-pulse bg-slate-200/80 rounded-xl`).

---

## 8. Responsivité & Prévention des Débordements

- Toujours utiliser `min-w-0` sur les conteneurs flex pour autoriser la troncature propre (`truncate`).
- Les tableaux doivent être enveloppés dans un conteneur à défilement horizontal : `<div className="overflow-x-auto scrollbar-none">`.
- Pas de débordement horizontal sur le document : `overflow-x-hidden` sur la racine flex.
