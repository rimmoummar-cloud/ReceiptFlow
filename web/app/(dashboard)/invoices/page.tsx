'use client';

import { useState } from 'react';
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from '@/hooks/useInvoices';
import { Invoice, InvoiceCategory, InvoiceStatus } from '@/types';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { InvoiceFormModal } from '@/components/invoices/InvoiceFormModal';
import { InvoiceDetailModal } from '@/components/invoices/InvoiceDetailModal';
import { DeleteConfirmModal } from '@/components/invoices/DeleteConfirmModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { INVOICE_CATEGORIES, INVOICE_STATUSES, SORT_OPTIONS } from '@/utils';
import { Plus, Filter, RefreshCw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvoicesPage() {
  // State for filters & pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('date_desc');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Queries & Mutations
  const { data, isLoading, isFetching, refetch } = useInvoices({
    page,
    pageSize,
    category: categoryFilter,
    status: statusFilter,
    sort,
  });

  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const deleteMutation = useDeleteInvoice();

  // Handlers
  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormModalOpen(true);
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedInvoice) {
      await updateMutation.mutateAsync({ id: selectedInvoice.id, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedInvoice) {
      await deleteMutation.mutateAsync(selectedInvoice.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    if (!data?.data || data.data.length === 0) {
       toast.error("No data to export");
       return;
    }
    const headers = ['ID', 'Merchant', 'Amount', 'Category', 'Status', 'Date', 'Description'];
    const rows = data.data.map(inv => [
      inv.id,
      `"${inv.merchant}"`, // escape commas
      inv.amount,
      inv.category,
      inv.status,
      inv.date,
      `"${inv.description || ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `receiptflow_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Invoices</h1>
          <p className="text-slate-400">Manage and track your company expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button 
             variant="secondary" 
             onClick={handleExportCSV} 
             icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button> */}
          <Button 
             variant="primary" 
             onClick={handleCreateNew} 
             icon={<Plus className="w-4 h-4" />}
          >
            New Invoice
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-48">
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All Categories"
            options={INVOICE_CATEGORIES.map(c => ({ value: c, label: c }))}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Statuses"
            options={INVOICE_STATUSES.map(s => ({ value: s, label: s }))}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            label="Sort By"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
        <div className="flex-1" />
        <Button 
          variant="secondary" 
          onClick={() => refetch()} 
          icon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-400' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

      {/* Main Table Content */}
<InvoiceTable
  invoices={data?.data?.items ?? []}
        isLoading={isLoading}
        sortValue={sort}
        onSortChange={setSort}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={handleView}
        onCreateNew={handleCreateNew}
      />

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl">
          <div className="text-sm text-slate-400">
            Showing <span className="font-medium text-slate-200">{((page - 1) * pageSize) + 1}</span> to <span className="font-medium text-slate-200">{Math.min(page * pageSize, data.totalCount)}</span> of <span className="font-medium text-slate-200">{data.totalCount}</span> results
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === data.totalPages}
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <InvoiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        invoice={selectedInvoice}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <InvoiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        invoice={selectedInvoice}
        onEdit={(invoice) => {
          setSelectedInvoice(invoice);
          setIsFormModalOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        invoice={selectedInvoice}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
