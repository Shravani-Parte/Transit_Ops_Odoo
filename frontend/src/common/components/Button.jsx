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
  );
}
