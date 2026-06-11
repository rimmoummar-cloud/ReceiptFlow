import { apiClient } from './client';
import { resolveApiBaseUrl } from '../lib/api-config';

export interface InvoiceListItem {
  id?: string;
  imageUrl?: string | null;
  ImageUrl?: string | null;
  [key: string]: unknown;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const parseApiEnvelope = <T>(payload: unknown) => {
  if (!isPlainObject(payload) || typeof payload.success !== 'boolean') {
    return null;
  }

  return {
    success: payload.success,
    data: (payload.data as T | null) ?? null,
    error: typeof payload.error === 'string' ? payload.error : null,
  };
};

const extractInvoiceItems = (payload: unknown): InvoiceListItem[] => {
  if (!isPlainObject(payload)) {
    return [];
  }

  const items = payload.items ?? payload.Items;
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(isPlainObject) as InvoiceListItem[];
};

export const resolveInvoiceImageUrl = (imageUrl?: string | null) => {
  const value = typeof imageUrl === 'string' ? imageUrl.trim() : '';

  if (!value) {
    return null;
  }

  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(value)) {
    return value;
  }

  try {
    return new URL(value, resolveApiBaseUrl()).toString();
  } catch {
    return value;
  }
};

export const invoicesApi = {
  list: async (): Promise<InvoiceListItem[]> => {
    const response = await apiClient.get<unknown>('/invoices');
    const envelope = parseApiEnvelope<unknown>(response.data);

    if (envelope && envelope.success === false) {
      throw new Error(envelope.error ?? 'Failed to load invoices.');
    }

    return extractInvoiceItems(envelope?.data ?? response.data);
  },
  upload: async (imageUri: string) => {
    const formData = new FormData();

    const filename = imageUri.split('/').pop() || 'invoice.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const { data } = await apiClient.post('/invoices/upload', formData);

    return data;
  },
};
