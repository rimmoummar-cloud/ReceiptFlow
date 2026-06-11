'use client';

import { Invoice } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import { Calendar, DollarSign, Tag, FileText } from 'lucide-react';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onEdit: (invoice: Invoice) => void;
}

export function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  onEdit,
}: InvoiceDetailModalProps) {
  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="md">
      <div className="space-y-6">
        {/* Header section */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-2xl">
            {getCategoryIcon(invoice.category)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{invoice.merchant}</h3>
            <p className="text-sm text-slate-400">{invoice.category}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Amount</span>
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(invoice.amount)}
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Status</span>
            </div>
            <Badge className={`mt-1 ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </Badge>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Date</span>
            </div>
            <p className="text-sm font-medium text-white">
              {formatDate(invoice.invoiceDate)}
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">ID</span>
            </div>
            <p className="text-sm font-mono text-slate-300 truncate">
              {invoice.id}
            </p>
          </div>
        </div>

        {/* Description */}
        {invoice.description && (
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <p className="text-xs font-medium text-slate-400 uppercase mb-2">
              Description
            </p>
            <p className="text-sm text-slate-200">{invoice.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(invoice);
            }}
          >
            Edit Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
}
