import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/common/utils/formatCurrency";
export default function MonthlyRevenueWidget({ data }) {
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Monthly Revenue</div>
      <div className="h-56"><ResponsiveContainer><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip formatter={(v) => formatCurrency(v)} /><Area type="monotone" dataKey="revenue" stroke="#C62828" fill="#FCE4E4" /></AreaChart></ResponsiveContainer></div>
    </div>
  );
}
