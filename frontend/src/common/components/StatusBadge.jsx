import { statusColorMap } from '../../config/theme';

export default function StatusBadge({ status }) {
  const cls = statusColorMap[status] || 'draft';
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium status-${cls}`}>
      {status}
    </span>
  );
}
