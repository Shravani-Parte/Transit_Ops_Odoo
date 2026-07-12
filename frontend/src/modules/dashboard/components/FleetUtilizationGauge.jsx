import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export default function FleetUtilizationGauge({ value = 0 }) {
  const data = [{ name: "Utilization", value }];
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Fleet Utilization</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={8} fill="#C62828" background />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-14 text-3xl font-semibold">{value}%</div>
      <div className="text-center text-xs text-text-muted mt-8">Active vehicles on trips vs available fleet</div>
    </div>
  );
}
