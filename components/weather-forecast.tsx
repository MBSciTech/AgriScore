"use client"

import { CloudRain, CloudSun, Sun } from "lucide-react"

export default function WeatherForecast() {
  const forecast = [
    { month: "January", condition: "Partly Cloudy", icon: CloudSun, rainfall: "45mm", risk: "Low" },
    { month: "February", condition: "Rainy", icon: CloudRain, rainfall: "80mm", risk: "Medium" },
    { month: "March", condition: "Sunny", icon: Sun, rainfall: "30mm", risk: "Low" },
  ]

  return (
    <div className="space-y-4">
      {forecast.map((month) => (
        <div key={month.month} className="flex items-center justify-between p-2 rounded-lg border bg-background/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <month.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{month.month}</div>
              <div className="text-xs text-muted-foreground">{month.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">{month.rainfall}</div>
            <div className="text-xs text-muted-foreground">Risk: {month.risk}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

