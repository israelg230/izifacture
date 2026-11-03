/**
 * Formatage monétaire pour izi facture (Zone UEMOA / CEMAC - Franc CFA)
 * Les montants en FCFA n'ont pas de centimes et s'affichent avec des espaces insécables.
 * Ex: 1250000 -> "1 250 000 FCFA"
 */

export function formatFCFA(amount: number | bigint): string {
  const numeric = typeof amount === "bigint" ? Number(amount) : amount;
  const rounded = Math.round(numeric);
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(rounded);

  return `${formatted} FCFA`;
}

export function formatFCFAShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".", ",")} M FCFA`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)} k FCFA`;
  }
  return formatFCFA(amount);
}

export function formatDateFR(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}
