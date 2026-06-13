'use client';

import { useState, useEffect } from 'react';
import { Invoice, CreateInvoiceRequest, InvoiceStatus, InvoiceCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { INVOICE_STATUSES, INVOICE_CATEGORIES, formatDateInput } from '@/utils';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInvoiceRequest) => void;
  invoice?: Invoice | null;
  isLoading?: boolean;
}

export function InvoiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  invoice,
  isLoading = false,
}: InvoiceFormModalProps) {
  const isEditing = !!invoice;

  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    merchant: '',
    amount: 0,
    category: 'Other' as InvoiceCategory,
    status: 'Pending' as InvoiceStatus,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        merchant: invoice.merchant,
        amount: invoice.amount,
        category: invoice.category,
        status: invoice.status,
        date: formatDateInput(invoice.invoiceDate),
        description: invoice.description || '',
      });
    } else {
      setFormData({
        merchant: '',
        amount: 0,
        category: 'Other',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [invoice, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchant.trim()) {
      newErrors.merchant = 'Merchant name is required';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const categoryOptions = INVOICE_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const statusOptions = INVOICE_STATUSES.map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Invoice' : 'Create New Invoice'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Merchant Name"
          placeholder="e.g., Starbucks, Amazon"
          value={formData.merchant}
          onChange={(e) =>
            setFormData({ ...formData, merchant: e.target.value })
          }
          error={errors.merchant}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            error={errors.amount}
          />

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            error={errors.date}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as InvoiceCategory,
              })
            }
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as InvoiceStatus,
              })
            }
          />
        </div>

        <Input
          label="Description (optional)"
          placeholder="Add a note..."
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
