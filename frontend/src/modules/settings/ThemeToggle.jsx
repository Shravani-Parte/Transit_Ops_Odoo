import React from "react";
import { Sun } from "lucide-react";
// Bonus: dark mode toggle. Enterprise style keeps light mode by default.
export default function ThemeToggle() {
  return <button className="btn-ghost" title="Dark mode (bonus)"><Sun size={14} /></button>;
}
