"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CloudSun, Droplets, FileBarChart, Info, Leaf, LineChart, Sprout, ThumbsUp } from "lucide-react"

interface FarmerData {
  id: string
  name: string
  email: string
  farm_size: number
  region: string
  created_at: string
  credit_score: number
  soil_health: number
  weather_risk: number
  past_yields: number
  gis_data: number
  market_trends: number
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchFarmerData = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("farmers")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (error) throw error
        setFarmerData(data)
      } catch (error) {
        console.error("Error fetching farmer data:", error)
        toast({
          title: "Error",
          description: "Failed to load farmer data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchFarmerData()
  }, [user])

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
              <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {farmerData?.name || user?.email}! Here's your farm's credit evaluation overview.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/profile")}>
                Edit Profile
              </Button>
              <Button onClick={() => router.push("/credit-evaluation")}>
                New Evaluation
              </Button>
              <Button variant="outline" onClick={() => router.push("/credit-analysis")}>
                View Analysis
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmerData?.credit_score || "N/A"}/100</div>
                <p className="text-xs text-muted-foreground">Overall creditworthiness</p>
                <Progress value={farmerData?.credit_score || 0} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Soil Health</CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmerData?.soil_health || "N/A"}/100</div>
                <p className="text-xs text-muted-foreground">Soil quality index</p>
                <Progress value={farmerData?.soil_health || 0} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weather Risk</CardTitle>
                <CloudSun className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmerData?.weather_risk || "N/A"}/100</div>
                <p className="text-xs text-muted-foreground">Climate risk assessment</p>
                <Progress value={farmerData?.weather_risk || 0} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Past Yields</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farmerData?.past_yields || "N/A"}/100</div>
                <p className="text-xs text-muted-foreground">Historical performance</p>
                <Progress value={farmerData?.past_yields || 0} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Score Details</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Credit Score Trend</CardTitle>
                    <p className="text-sm text-muted-foreground">Your score history over time</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Chart will be implemented here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                    <p className="text-sm text-muted-foreground">Factors affecting your credit score</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Soil Health</span>
                          <span className="text-sm font-medium">{farmerData?.soil_health || 0}/100</span>
                        </div>
                        <Progress value={farmerData?.soil_health || 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Weather Risk</span>
                          <span className="text-sm font-medium">{farmerData?.weather_risk || 0}/100</span>
                        </div>
                        <Progress value={farmerData?.weather_risk || 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Past Yields</span>
                          <span className="text-sm font-medium">{farmerData?.past_yields || 0}/100</span>
                        </div>
                        <Progress value={farmerData?.past_yields || 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Detailed Score Analysis
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Complete breakdown of your credit evaluation</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Soil Health (30%)</h4>
                        <span className="text-sm font-medium">{farmerData?.soil_health || 0}/30</span>
                      </div>
                      <Progress
                        value={farmerData?.soil_health ? (farmerData.soil_health / 30) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your soil has good nutrient levels but could benefit from improved pH balance.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Weather Risk (25%)</h4>
                        <span className="text-sm font-medium">{farmerData?.weather_risk || 0}/25</span>
                      </div>
                      <Progress
                        value={farmerData?.weather_risk ? (farmerData.weather_risk / 25) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Weather conditions for the next growing season are favorable.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Past Yields (20%)</h4>
                        <span className="text-sm font-medium">{farmerData?.past_yields || 0}/20</span>
                      </div>
                      <Progress
                        value={farmerData?.past_yields ? (farmerData.past_yields / 20) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your crop yields have been consistent but slightly below regional averages.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">GIS Data (15%)</h4>
                        <span className="text-sm font-medium">{farmerData?.gis_data || 0}/15</span>
                      </div>
                      <Progress
                        value={farmerData?.gis_data ? (farmerData.gis_data / 15) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Your farm's location and topography are favorable for your chosen crops.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Market Trends (10%)</h4>
                        <span className="text-sm font-medium">{farmerData?.market_trends || 0}/10</span>
                      </div>
                      <Progress
                        value={farmerData?.market_trends ? (farmerData.market_trends / 10) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Market prices for your crops are projected to remain stable.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Recommendations</CardTitle>
                  <p className="text-sm text-muted-foreground">Actions to enhance your credit score</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-background/50">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <Sprout className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Improve Soil pH Balance</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Adding lime to your soil can help balance pH levels, potentially increasing your score by 3 points.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Learn How
                          <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-background/50">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Implement Drip Irrigation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Upgrading to drip irrigation can improve water efficiency and yield, potentially adding 4 points to your score.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Learn How
                          <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-background/50">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                        <LineChart className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Diversify Crop Selection</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Adding a secondary crop with rising market demand could improve your market trends score by 2 points.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Learn How
                          <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

