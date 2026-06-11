'use client';

import { useState, useMemo } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { formatCurrency, INVOICE_CATEGORIES, getCategoryIcon } from '@/utils';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Receipt, AlertCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#64748b'];

export default function AnalyticsPage() {
  const { data, isLoading } = useInvoices({ pageSize: 1000 }); // fetch large amount for analytics

  const analytics = useMemo(() => {
    if (!data?.data) return null;

   const invoices = data?.data?.items || [];
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);

    // Category breakdown
    const categoryDataMap: Record<string, number> = {};
    invoices.forEach(inv => {
      categoryDataMap[inv.category] = (categoryDataMap[inv.category] || 0) + inv.amount;
    });
    
    const categoryData = Object.entries(categoryDataMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly breakdown (simple version based on dates)
    const monthlyDataMap: Record<string, number> = {};
    invoices.forEach(inv => {
      const date = new Date(inv.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyDataMap[monthYear] = (monthlyDataMap[monthYear] || 0) + inv.amount;
    });

    const monthlyData = Object.entries(monthlyDataMap)
      .map(([month, total]) => ({ month, total }))
      .reverse(); // assuming mostly recent data

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      categoryData,
      monthlyData,
      totalCount: invoices.length
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Overview</h1>
          <p className="text-slate-400">Loading your spending data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 min-h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 min-h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Analytics Overview</h1>
        <p className="text-slate-400">Track and analyze your invoice spending patterns.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Total Spent</h3>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(analytics.totalAmount)}</p>
          <p className="text-sm text-slate-500 mt-1">Across {analytics.totalCount} invoices</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Paid Amount</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(analytics.paidAmount)}</p>
          <p className="text-sm text-slate-500 mt-1">Successfully settled</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Pending Amount</h3>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(analytics.pendingAmount)}</p>
          <p className="text-sm text-slate-500 mt-1">Awaiting payment</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Overdue Amount</h3>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(analytics.overdueAmount)}</p>
          <p className="text-sm text-slate-500 mt-1">Needs immediate attention</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Spending by Category</h3>
          <div className="flex-1 min-h-[300px]">
            {analytics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>
        </div>

        {/* Monthly Spending Bar Chart */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Spending</h3>
          <div className="flex-1 min-h-[300px]">
             {analytics.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b' }} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc' }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
