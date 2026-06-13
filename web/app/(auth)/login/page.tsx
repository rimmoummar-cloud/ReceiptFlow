'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../store/authContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Mail, Lock } from 'lucide-react';
import { useEffect } from "react";
import toast from 'react-hot-toast';


export default function LoginPage() {
  
  const router = useRouter();
const { login, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      router.push('/invoices');
    } catch (error: any) {
  toast.error(
    error.response?.data?.error ||
    "Something went wrong"
  );
} finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
  const initGoogle = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "365135028752-i2d570thjfhi0ffb9eeedt8hagb7rtbt.apps.googleusercontent.com",
      callback: async (response: any) => {
        const res = await fetch(
          "https://receiptflow-1.onrender.com/api/auth/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
          }
        );

        const data = await res.json();

        if (data.token) {
        setAuth({
  token: data.token,
  user: data.user
});
          router.push("/invoices");
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large", width: 300 }
    );
  };

  initGoogle();
}, []);
// useEffect(() => {
//   if (!window.google) return;

//   window.google.accounts.id.initialize({
//     client_id: "365135028752-i2d570thjfhi0ffb9eeedt8hagb7rtbt.apps.googleusercontent.com",

//     callback: async (response: any) => {
//       try {
//         const res = await fetch(
//           "https://receiptflow-1.onrender.com/api/auth/google",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               token: response.credential,
//             }),
//           }
//         );

//         const data = await res.json();

//         if (data.token) {
//           await login(data.token);
//           router.push("/invoices");
//         }
//       } catch (err) {
//         console.error("Google login error", err);
//       }
//     },
//   });

//   window.google.accounts.id.renderButton(
//     document.getElementById("googleBtn"),
//     {
//       theme: "outline",
//       size: "large",
//       width: 300,
//     }
//   );
// }, []);
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-800/50">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
        <p className="text-sm text-slate-400 mt-2">Enter your details to access your dashboard</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
          icon={<Lock className="w-5 h-5" />}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {/* <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-slate-900"
            /> */}
            {/* <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
              Remember me
            </label> */}
          </div>

          {/* <div className="text-sm">
            <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div> */}
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
          Sign in
        </Button>
        <div id="googleBtn" className="mt-4 flex justify-center" />
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-500">New to ReceiptFlow?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/register" className="w-full inline-flex justify-center rounded-xl border border-slate-700 bg-transparent py-2.5 px-4 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
