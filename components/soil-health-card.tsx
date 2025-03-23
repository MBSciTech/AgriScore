"use client"

import { Progress } from "@/components/ui/progress"

export default function SoilHealthCard() {
  const soilMetrics = [
    { name: "Nitrogen", value: 65, status: "Good" },
    { name: "Phosphorus", value: 70, status: "Good" },
    { name: "Potassium", value: 80, status: "Excellent" },
    { name: "pH Level", value: 55, status: "Fair" },
  ]

  return (
    <div className="space-y-4">
      {soilMetrics.map((metric) => (
        <div key={metric.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{metric.name}</span>
            <span className="text-xs">{metric.status}</span>
          </div>
          <Progress value={metric.value} className="h-2" />
        </div>
      ))}
    </div>
  )
}

