import { InvoiceStatus, InvoiceCategory } from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateInput(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function getStatusColor(status: InvoiceStatus): string {
  const colors: Record<InvoiceStatus, string> = {
    Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    Draft: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };
  return colors[status] || colors.Draft;
}

export function getCategoryIcon(category: InvoiceCategory): string {
  const icons: Record<InvoiceCategory, string> = {
    'Food & Dining': '🍽️',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Utilities: '⚡',
    Healthcare: '🏥',
    Travel: '✈️',
    Education: '📚',
    Other: '📦',
  };
  return icons[category] || '📦';
}

export const INVOICE_STATUSES: InvoiceStatus[] = ['Paid', 'Pending', 'Overdue', 'Draft'];

export const INVOICE_CATEGORIES: InvoiceCategory[] = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other',
];

export const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'amount_desc', label: 'Highest Amount' },
  { value: 'amount_asc', label: 'Lowest Amount' },
];

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
