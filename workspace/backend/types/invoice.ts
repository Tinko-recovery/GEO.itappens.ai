export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface CreateInvoiceRequest {
  client_name: string;
  client_email: string;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status?: InvoiceStatus;
  due_date: string; // ISO 8601 date string
}

export interface UpdateInvoiceRequest {
  client_name?: string;
  client_email?: string;
  line_items?: LineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  status?: InvoiceStatus;
  due_date?: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  line_items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ApiErrorResponse {
  error: string;
  code: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface CheckOverdueResponse {
  updated: number;
}
