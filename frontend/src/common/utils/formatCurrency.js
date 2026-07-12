/** INR formatting per mock's Settings → Currency. */
export function formatCurrency(amount, currency = "INR") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount));
}
