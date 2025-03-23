"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 67 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 70 },
  { month: "May", score: 72 },
  { month: "Jun", score: 71 },
  { month: "Jul", score: 73 },
  { month: "Aug", score: 75 },
  { month: "Sep", score: 74 },
  { month: "Oct", score: 76 },
  { month: "Nov", score: 77 },
  { month: "Dec", score: 78 },
]

export default function CreditScoreChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis domain={[50, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

