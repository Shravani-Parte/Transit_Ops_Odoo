export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
}
