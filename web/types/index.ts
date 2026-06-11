// ==========================================
// ReceiptFlow - Type Definitions
// ==========================================

// --- Auth Types ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

// --- Invoice Types ---

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export type InvoiceCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Other';

export interface Invoice {
  id: string;
  merchant: string;
  amount: number;
  category: InvoiceCategory;
  status: InvoiceStatus;
  date: string;
  description?: string;
    ImageUrl?: string | null; // 👈 add this
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  merchant: string;
  amount: number;
  category: InvoiceCategory;
  status: InvoiceStatus;
  date: string;
  description?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string; 
}

// --- API Types ---

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface InvoiceQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: string;
  sort?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// --- UI Types ---

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: 'amount' | 'date';
  direction: SortDirection;
}

export interface FilterConfig {
  category: string;
  status: string;
}

// --- Analytics Types ---

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}
