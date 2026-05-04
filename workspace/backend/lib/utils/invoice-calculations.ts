import { Decimal } from '@prisma/client/runtime/library';

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export function calculateLineItemAmount(
  quantity: number,
  unitPrice: number
): number {
  return parseFloat((quantity * unitPrice).toFixed(2));
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  return parseFloat(
    lineItems
      .reduce((sum, item) => sum + (item.amount || 0), 0)
      .toFixed(2)
  );
}

export function calculateTax(subtotal: number, taxRate: number = 0.1): number {
  return parseFloat((subtotal * taxRate).toFixed(2));
}

export function calculateTotal(subtotal: number, tax: number): number {
  return parseFloat((subtotal + tax).toFixed(2));
}

export function validateCalculations(
  subtotal: number,
  tax: number,
  total: number
): boolean {
  const calculatedTotal = calculateTotal(subtotal, tax);
  return Math.abs(calculatedTotal - total) < 0.01;
}

export function normalizeDecimals(
  subtotal: number | string,
  tax: number | string,
  total: number | string
): { subtotal: number; tax: number; total: number } {
  return {
    subtotal: parseFloat(String(subtotal).slice(0, 12)),
    tax: parseFloat(String(tax).slice(0, 12)),
    total: parseFloat(String(total).slice(0, 12)),
  };
}
