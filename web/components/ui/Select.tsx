'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 px-4 py-2.5 text-sm appearance-none cursor-pointer ${error ? 'border-rose-500' : ''} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-slate-900">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-rose-400">⚠ {error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
