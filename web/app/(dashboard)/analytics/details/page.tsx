'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils';

export default function AnalyticsDetailsPage() {
  const { data, isLoading } = useAnalytics(1000);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const analytics = data;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Analytics Details
        </h1>
        <p className="text-slate-400">
          Deep insights into your spending behavior
        </p>
      </div>

      {/* ALERT CARD */}
      {analytics?.alert?.isOverLimit && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle className="text-rose-400 w-5 h-5 mt-1" />
          <div>
            <p className="text-rose-300 font-semibold">
              {analytics.alert.message}
            </p>
            <p className="text-slate-400 text-sm">
              {formatCurrency(analytics.alert.current)} / {formatCurrency(analytics.alert.limit)}
            </p>
          </div>
        </div>
      )}

      {/* MONTHLY */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-blue-400 w-5 h-5" />
          <h2 className="text-white font-semibold">Monthly Breakdown</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {analytics?.monthly?.map((m: any) => (
            <div
              key={m.month}
              className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30"
            >
              <p className="text-slate-400 text-sm">{m.month}</p>
              <p className="text-white text-xl font-bold">
                {formatCurrency(m.total)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* YEARLY */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-emerald-400 w-5 h-5" />
          <h2 className="text-white font-semibold">Yearly Overview</h2>
        </div>

        <div className="space-y-3">
          {analytics?.yearly?.map((y: any) => (
            <div
              key={y.year}
              className="flex justify-between items-center bg-slate-800/30 p-4 rounded-xl"
            >
              <span className="text-slate-300">{y.year}</span>
              <span className="text-white font-bold">
                {formatCurrency(y.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}