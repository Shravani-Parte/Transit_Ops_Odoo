
export default function Toast({ message, type = "info", onClose }) {
  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${colors[type]}`}>
      {message}
      <button onClick={onClose} className="ml-4">✕</button>
    </div>
  );
}
