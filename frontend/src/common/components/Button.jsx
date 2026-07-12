<<<<<<< HEAD
import React from "react";
import clsx from "clsx";

export default function Button({ variant = "primary", className, children, ...rest }) {
  const cls = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    ghost: "btn-ghost",
  }[variant] || "btn-primary";
  return (
    <button className={clsx(cls, className)} {...rest}>{children}</button>
=======
export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
    secondary: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
  );
}
