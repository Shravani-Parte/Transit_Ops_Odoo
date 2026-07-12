<<<<<<< HEAD
import React from "react";
import clsx from "clsx";

export default function Select({ label, error, options = [], className, children, ...rest }) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select className={clsx("input", error && "border-danger", className)} {...rest}>
        {children || options.map((o) =>
          typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      {error && <div className="mt-1 text-xs text-danger">{error}</div>}
=======
export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
    </div>
  );
}
