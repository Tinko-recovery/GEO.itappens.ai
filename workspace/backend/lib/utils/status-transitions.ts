export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export const ALLOWED_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['sent'],
  sent: ['paid', 'overdue'],
  paid: [],
  overdue: ['paid'],
};

export function isValidTransition(
  currentStatus: InvoiceStatus,
  newStatus: InvoiceStatus
): boolean {
  if (currentStatus === newStatus) {
    return true;
  }
  return ALLOWED_TRANSITIONS[currentStatus].includes(newStatus);
}

export function getAllowedTransitions(
  currentStatus: InvoiceStatus
): InvoiceStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus];
}
