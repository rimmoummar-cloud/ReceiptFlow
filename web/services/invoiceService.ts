import apiClient from './apiClient';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  PaginatedResponse,
  InvoiceQueryParams,
} from '@/types';

export const invoiceService = {
  async getInvoices(params: InvoiceQueryParams = {}): Promise<PaginatedResponse<Invoice>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);

    const response = await apiClient.get<PaginatedResponse<Invoice>>(
      `/invoices?${queryParams.toString()}`
    );
    return response.data;
  },

  async getInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    const response = await apiClient.post<Invoice>('/invoices', data);
    return response.data;
  },

  async updateInvoice({ id, ...data }: UpdateInvoiceRequest): Promise<Invoice> {
    const response = await apiClient.put<Invoice>(`/invoices/${id}`, data);
    return response.data;
  },

  async deleteInvoice(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },
};
