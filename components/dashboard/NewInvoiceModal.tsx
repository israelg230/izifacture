"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, ArrowRight } from "lucide-react";
import { Invoice, Client, PaymentMethod, InvoiceItem } from "@/lib/types";
import { formatFCFA } from "@/lib/money";
import { DatePicker } from "@/components/ui/DatePicker";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddInvoice: (newInvoice: Invoice) => void;
}

export function NewInvoiceModal({
  isOpen,
  onClose,
  clients,
  onAddInvoice,
}: NewInvoiceModalProps) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [projectTitle, setProjectTitle] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wave");
  const [priority, setPriority] = useState<"Haute" | "Normale" | "Basse">("Normale");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<
    Array<{ id: string; description: string; quantity: number; unitPrice: number; taxRate: number }>
  >([
    {
      id: "1",
      description: "Prestation de développement & intégration",
      quantity: 1,
      unitPrice: 500000,
      taxRate: 18,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: "",
        quantity: 1,
        unitPrice: 100000,
        taxRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: "description" | "quantity" | "unitPrice" | "taxRate",
    value: any
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const calculatedItems: InvoiceItem[] = items.map((item) => {
    const subtotal = Math.round(item.quantity * item.unitPrice);
    const taxAmount = Math.round((subtotal * item.taxRate) / 100);
    const total = subtotal + taxAmount;
    return {
      ...item,
      subtotal,
      taxAmount,
      total,
    };
  });

  const subtotalHT = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const taxTotal = calculatedItems.reduce((acc, curr) => acc + curr.taxAmount, 0);
  const totalTTC = subtotalHT + taxTotal;

  const handleSubmit = (e: React.FormEvent, status: "sent" | "draft") => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      number: `FAC-2024-${randomNum}`,
      client,
      projectTitle: projectTitle || "Prestation de services professionnels",
      issueDate,
      dueDate,
      status,
      subtotal: subtotalHT,
      taxTotal,
      total: totalTTC,
      amountPaid: 0,
      balanceDue: totalTTC,
      paymentMethod,
      priority,
      notes,
      items: calculatedItems,
    };

    onAddInvoice(newInvoice);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Créer une nouvelle facture"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 animate-in fade-in"
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[28px] border border-slate-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Créer une nouvelle facture
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
              FCFA (XOF)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Flat */}
        <form
          onSubmit={(e) => handleSubmit(e, "sent")}
          className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1 bg-slate-50"
        >
          {/* General info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Informations générales
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client destinataire *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.name} - {c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Intitulé du projet / Objet de la facture *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campagne Marketing Digitale Q4"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <DatePicker
                label="Date d'émission"
                value={issueDate}
                onChange={setIssueDate}
              />

              <DatePicker
                label="Date d'échéance de paiement"
                value={dueDate}
                onChange={setDueDate}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mode de règlement privilégié
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
                >
                  <option value="wave">Wave (Côte d'Ivoire / Sénégal)</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="moov_money">Moov Money</option>
                  <option value="bank_transfer">Virement Bancaire</option>
                  <option value="cash">Espèces</option>
                  <option value="check">Chèque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Priorité
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-violet-500"
                >
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lignes de facturation (TVA 18% automatique)
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      required
                      placeholder="Description de la prestation"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-center text-slate-900 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="w-36 shrink-0">
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      placeholder="Prix unit. FCFA"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "unitPrice",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-right text-slate-900 focus:outline-none focus:border-violet-500 font-semibold"
                    />
                  </div>

                  <div className="w-20 shrink-0 text-center text-xs font-bold text-slate-600">
                    TVA 18%
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Supprimer la ligne"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Live calculation totals */}
            <div className="pt-3 border-t border-slate-200 flex flex-col items-end gap-1.5 text-xs">
              <div className="flex items-center justify-between w-64 text-slate-600">
                <span>Sous-total HT :</span>
                <span className="font-bold text-slate-900">
                  {formatFCFA(subtotalHT)}
                </span>
              </div>
              <div className="flex items-center justify-between w-64 text-slate-600">
                <span>TVA (18%) :</span>
                <span className="font-bold text-slate-900">
                  {formatFCFA(taxTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between w-64 text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Total TTC :</span>
                <span className="text-base text-violet-700">
                  {formatFCFA(totalTTC)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes pour le client ou coordonnées de règlement
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Merci pour votre confiance. Règlement par Wave au +225 07 88 45 12 90."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Enregistrer comme brouillon
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#111318] hover:bg-violet-600 active:bg-violet-700 text-white text-xs font-bold shadow-sm hover:shadow-md hover:shadow-violet-500/25 active:scale-95 transition-all duration-200"
            >
              <span>Émettre et Envoyer la Facture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
