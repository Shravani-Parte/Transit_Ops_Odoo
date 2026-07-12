export function formatDate(input, opts = { day: "2-digit", month: "short", year: "numeric" }) {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", opts);
}

export function formatDateTime(input) {
  if (!input) return "—";
  const d = new Date(input);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function daysUntil(dateInput) {
  const d = new Date(dateInput);
  return Math.floor((d - new Date()) / (1000 * 60 * 60 * 24));
}
