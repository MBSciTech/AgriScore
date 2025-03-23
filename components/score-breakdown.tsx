"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Soil Health", value: 30, color: "hsl(var(--primary))" },
  { name: "Weather", value: 25, color: "hsl(var(--secondary))" },
  { name: "Past Yields", value: 20, color: "#4ade80" },
  { name: "GIS Data", value: 15, color: "#60a5fa" },
  { name: "Market Trends", value: 10, color: "#f97316" },
]

export default function ScoreBreakdown() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value}%`, "Weight"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

