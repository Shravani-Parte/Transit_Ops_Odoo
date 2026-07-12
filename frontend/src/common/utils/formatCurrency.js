<<<<<<< HEAD
/** INR formatting per mock's Settings → Currency. */
export function formatCurrency(amount, currency = "INR") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount));
=======
export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
