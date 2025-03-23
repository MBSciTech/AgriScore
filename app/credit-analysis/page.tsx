"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface FarmerData {
  id: string
  credit_score: number
  farm_size: number
  region: string
}

interface HistoricalData {
  date: string
  credit_score: number
  soil_health: number
  weather_risk: number
  past_yields: number
}

interface WeatherData {
  temperature: number
  rainfall: number
  forecast: Array<{
    date: string
    temperature: number
    rainfall: number
  }>
}

const REGION_TO_CITY: Record<string, string> = {
  "south": "Chennai,IN",
  "east": "Kolkata,IN",
  "north": "Delhi,IN",
  "west": "Mumbai,IN"
}

export default function CreditAnalysisPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch farmer data
        const { data: farmerData, error: farmerError } = await supabase
          .from("farmers")
          .select("id, credit_score, farm_size, region")
          .eq("user_id", user.id)
          .single()

        if (farmerError) {
          if (farmerError.code === "PGRST116") {
            // Create farmer record if it doesn't exist
            const { data: newFarmer, error: createError } = await supabase
              .from("farmers")
              .insert([
                {
                  user_id: user.id,
                  name: user.email?.split("@")[0] || "Farmer",
                  email: user.email || "",
                  credit_score: 0,
                  farm_size: 0,
                  region: "Default",
                },
              ])
              .select()
              .single()

            if (createError) throw createError
            setFarmerData(newFarmer)
          } else {
            throw farmerError
          }
        } else {
          setFarmerData(farmerData)
        }

        // Fetch historical data using the farmer's ID
        if (farmerData?.id) {
          const { data: historicalData, error: historicalError } = await supabase
            .from("historical_data")
            .select("*")
            .eq("farmer_id", farmerData.id)
            .order("date", { ascending: true })
            .limit(12)

          if (historicalError) {
            console.error("Historical data error:", historicalError)
            setHistoricalData([])
          } else {
            setHistoricalData(historicalData || [])
          }
        }

        // Fetch weather data from API
        if (farmerData?.region) {
          try {
            // Find the matching city based on the region
            const region = farmerData.region.toLowerCase().trim()
            const city = REGION_TO_CITY[region] || "Mumbai,IN" // Default to Mumbai if no match found

            const weatherResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
            )
            const weatherData = await weatherResponse.json()

            // Process weather data
            const processedWeatherData: WeatherData = {
              temperature: weatherData.list[0].main.temp,
              rainfall: weatherData.list[0].rain?.["3h"] || 0,
              forecast: weatherData.list.slice(0, 5).map((item: any) => ({
                date: new Date(item.dt * 1000).toLocaleDateString(),
                temperature: item.main.temp,
                rainfall: item.rain?.["3h"] || 0,
              })),
            }
            setWeatherData(processedWeatherData)
          } catch (weatherError) {
            console.error("Weather API error:", weatherError)
            toast({
              title: "Weather Data Error",
              description: "Failed to fetch weather data for your region. Please try again later.",
              variant: "destructive",
            })
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  const chartData = {
    labels: historicalData.map((data) => new Date(data.date).toLocaleDateString()),
    datasets: [
      {
        label: "Credit Score",
        data: historicalData.map((data) => data.credit_score),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        yAxisID: "y",
      },
      {
        label: "Soil Health",
        data: historicalData.map((data) => data.soil_health),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        yAxisID: "y1",
      },
      {
        label: "Weather Risk",
        data: historicalData.map((data) => data.weather_risk),
        borderColor: "rgb(53, 162, 235)",
        tension: 0.1,
        yAxisID: "y1",
      },
      {
        label: "Past Yields",
        data: historicalData.map((data) => data.past_yields),
        borderColor: "rgb(255, 205, 86)",
        tension: 0.1,
        yAxisID: "y1",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Historical Performance",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Credit Score",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Other Metrics",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading data...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Credit Analysis</h1>
              <p className="text-muted-foreground">
                View your credit score and performance metrics.
              </p>
            </div>
            <Button onClick={() => router.push("/credit-evaluation")}>
              New Evaluation
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
                <CardDescription>Your current credit score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{farmerData?.credit_score || 0}</div>
                <Progress value={farmerData?.credit_score || 0} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farm Size</CardTitle>
                <CardDescription>Total farm area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{farmerData?.farm_size || 0}</div>
                <div className="text-sm text-muted-foreground mt-2">acres</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Temperature</CardTitle>
                <CardDescription>Real-time weather</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {weatherData?.temperature ? `${Math.round(weatherData.temperature)}°C` : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {weatherData?.rainfall ? `${weatherData.rainfall}mm rainfall` : "No rainfall"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Region</CardTitle>
                <CardDescription>Farm location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold capitalize">{farmerData?.region || "N/A"}</div>
                <div className="text-sm text-muted-foreground mt-2">Primary farming area</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Historical data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Line data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>

          {weatherData?.forecast && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weather Forecast</CardTitle>
                  <CardDescription>5-day weather prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weatherData.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-card text-card-foreground"
                      >
                        <div className="text-sm font-medium">{day.date}</div>
                        <div className="text-2xl font-bold mt-2">
                          {Math.round(day.temperature)}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {day.rainfall}mm rain
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 