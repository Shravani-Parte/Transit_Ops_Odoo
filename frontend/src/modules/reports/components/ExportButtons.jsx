import React from "react";
import { Download, FileText } from "lucide-react";
import Button from "@/common/components/Button";
import useToast from "@/common/hooks/useToast";

export default function ExportButtons({ rows, filename = "report.csv" }) {
  const { push } = useToast();
  const exportCsv = () => {
    if (!rows?.length) { push("No rows to export", "warning"); return; }
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(","), ...rows.map(r => cols.map(c => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    push("CSV downloaded", "success");
  };
  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={exportCsv}><Download size={14} /> Export CSV</Button>
      <Button variant="secondary" onClick={() => push("PDF export is a bonus feature — not implemented in demo", "info")}><FileText size={14} /> Export PDF</Button>
    </div>
  );
}
