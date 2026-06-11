'use client';

import { useState } from 'react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pencil, Trash2, Eye, ChevronUp, ChevronDown, FileText } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  sortValue: string;
  onSortChange: (sort: string) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
  onCreateNew: () => void;
}

export function InvoiceTable({
  invoices,
  isLoading,
  sortValue,
  onSortChange,
  onEdit,
  onDelete,
  onView,
  onCreateNew,
}: InvoiceTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (field: string) => {
    const currentField = sortValue.split('_')[0];
    const currentDir = sortValue.split('_')[1];

    if (currentField === field) {
      onSortChange(`${field}_${currentDir === 'asc' ? 'desc' : 'asc'}`);
    } else {
      onSortChange(`${field}_desc`);
    }
  };

  const getSortIcon = (field: string) => {
    const currentField = sortValue.split('_')[0];
    const currentDir = sortValue.split('_')[1];

    if (currentField !== field) {
      return <ChevronUp className="w-3.5 h-3.5 text-slate-600" />;
    }
    return currentDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl">
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-500" />}
          title="No invoices found"
          description="Get started by creating your first invoice, or try adjusting your filters."
          action={
            <Button onClick={onCreateNew} variant="primary">
              Create Invoice
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Merchant
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1.5">
                  Amount
                  {getSortIcon('amount')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1.5">
                  Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className={`border-b border-slate-800/30 transition-all duration-150 ${
                  hoveredRow === invoice.id
                    ? 'bg-slate-800/30'
                    : 'hover:bg-slate-800/20'
                }`}
                onMouseEnter={() => setHoveredRow(invoice.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-lg">
                      {getCategoryIcon(invoice.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {invoice.merchant}
                      </p>
                      {invoice.description && (
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">
                          {invoice.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-200">
                    {formatCurrency(invoice.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-400">{invoice.category}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-400">
                    {formatDate(invoice.invoiceDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(invoice)}
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(invoice)}
                      className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(invoice)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-800/50">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 hover:bg-slate-800/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-lg">
                  {getCategoryIcon(invoice.category)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {invoice.merchant}
                  </p>
                  <p className="text-xs text-slate-500">{invoice.category}</p>
                </div>
              </div>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-200">
                  {formatCurrency(invoice.amount)}
                </p>
                <p className="text-xs text-slate-500">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(invoice)}
                  className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(invoice)}
                  className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(invoice)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
