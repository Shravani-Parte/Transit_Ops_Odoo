<<<<<<< HEAD
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
=======
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
