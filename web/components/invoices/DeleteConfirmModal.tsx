'use client';

import { Invoice } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoice: Invoice | null;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  invoice,
  isLoading = false,
}: DeleteConfirmModalProps) {
  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Invoice" size="sm">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete the invoice from{' '}
              <span className="font-semibold text-white">
                {invoice.merchant}
              </span>{' '}
              for{' '}
              <span className="font-semibold text-white">
                {formatCurrency(invoice.amount)}
              </span>
              ?
            </p>
            <p className="text-sm text-slate-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Invoice
          </Button>
        </div>
      </div>
    </Modal>
  );
}
