export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colors[color]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
