import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export default function FleetUtilizationChart({ data }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Trips Completed / Month</div>
      <div className="h-56"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="trips" stroke="#2E7D32" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
    </div>
  );
}
