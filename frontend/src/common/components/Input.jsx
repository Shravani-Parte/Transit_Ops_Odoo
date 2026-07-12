import React from "react";
import clsx from "clsx";

export default function Input({ label, error, className, ...rest }) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input className={clsx("input", error && "border-danger", className)} {...rest} />
      {error && <div className="mt-1 text-xs text-danger">{error}</div>}
    </div>
  );
}
