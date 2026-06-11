'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/authContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await register(formData.email, formData.password, formData.fullName);
      toast.success('Account created successfully!');
      router.push('/invoices');
    } catch (error) {
      // Error is handled globally by axios interceptor
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800/50">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-white">Create a new account</h2>
        <p className="text-sm text-slate-400 mt-2">Start managing your invoices today</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          icon={<User className="w-5 h-5" />}
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          required
          icon={<Mail className="w-5 h-5" />}
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock className="w-5 h-5" />}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock className="w-5 h-5" />}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-500">Already have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/login" className="w-full inline-flex justify-center rounded-xl border border-slate-700 bg-transparent py-2.5 px-4 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
