
export default function EmptyState({ message = "No data available" }) {
  return (
    <div className="p-12 text-center text-slate-500">
      {message}
    </div>
  );
}
