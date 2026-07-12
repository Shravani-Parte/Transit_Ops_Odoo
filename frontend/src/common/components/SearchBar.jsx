<<<<<<< HEAD
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" />
      <input
        className="input pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
=======
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 w-full max-w-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
      />
    </div>
  );
}
