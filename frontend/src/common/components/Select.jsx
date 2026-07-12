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
    </div>
  );
}
