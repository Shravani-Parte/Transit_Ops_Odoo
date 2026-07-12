<<<<<<< HEAD
import React from "react";
import clsx from "clsx";

export default function Input({ label, error, className, ...rest }) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input className={clsx("input", error && "border-danger", className)} {...rest} />
      {error && <div className="mt-1 text-xs text-danger">{error}</div>}
=======
export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
