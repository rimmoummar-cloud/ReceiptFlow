'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Zap, Shield, BarChart3, Clock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            ReceiptFlow
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign in
          </Link> */}
          {/* <Link href="/register">
            <Button variant="primary">Get Started</Button>
          </Link> */}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          ReceiptFlow 2.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Manage your invoices with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            intelligent automation
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          The modern SaaS dashboard to track spending, manage invoices, and gain powerful analytics insights for your business.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full" icon={<ArrowRight className="w-5 h-5" />}>
              Start for free
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
            <p className="text-slate-400 text-sm">Enterprise-grade security for all your financial documents and data.</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Analytics</h3>
            <p className="text-slate-400 text-sm">Beautiful charts and insights to track your spending habits over time.</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Sync</h3>
            <p className="text-slate-400 text-sm">Your data is always up-to-date across all your devices instantly.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 ReceiptFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
