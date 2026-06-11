export interface User {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface AuthSession {
  token: string | null;
  user: User | null;
  raw: unknown;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

export interface InvoiceUploadResponse {
  id: string;
  extractedData: Record<string, any>;
  status: string;
}
