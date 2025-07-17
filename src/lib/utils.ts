import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Invoice storage utilities
export function saveInvoiceToStorage(invoice) {
  const invoices = getInvoicesFromStorage();
  invoices[invoice.id] = invoice;
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

export function getInvoiceFromStorage(invoiceId) {
  const invoices = getInvoicesFromStorage();
  return invoices[invoiceId] || null;
}

export function getInvoicesFromStorage() {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem("invoices");
  return data ? JSON.parse(data) : {};
}
