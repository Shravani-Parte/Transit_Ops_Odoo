import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export default function FuelEfficiencyChart({ data }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Fuel Efficiency (km/L)</div>
      <div className="h-56"><ResponsiveContainer><BarChart data={data.filter(d => d.kmpl != null)}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="registration_number" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="kmpl" fill="#1976D2" /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
