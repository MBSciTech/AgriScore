"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Check, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

const steps = [
  {
    id: "farm-details",
    title: "Farm Details",
    description: "Basic information about your farm",
  },
  {
    id: "soil-health",
    title: "Soil Health",
    description: "Information about your soil quality",
  },
  {
    id: "weather-risk",
    title: "Weather Risk",
    description: "Climate and weather conditions",
  },
  {
    id: "past-yields",
    title: "Past Yields",
    description: "Historical crop performance",
  },
  {
    id: "review",
    title: "Review",
    description: "Review and submit your evaluation",
  },
]

export default function CreditEvaluationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    farmSize: "",
    region: "",
    soilType: "",
    soilPh: "",
    annualRainfall: "",
    temperature: "",
    lastYearYield: "",
    averageYield: "",
    cropType: "",
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!formData.farmSize || !formData.region || !formData.cropType || 
          !formData.soilType || !formData.soilPh || !formData.annualRainfall || 
          !formData.temperature || !formData.lastYearYield || !formData.averageYield) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Format the data for submission
      const evaluationData = {
        farmer_id: user?.id,
        farm_size: parseFloat(formData.farmSize),
        region: formData.region,
        crop_type: formData.cropType,
        soil_type: formData.soilType,
        soil_ph: parseFloat(formData.soilPh),
        annual_rainfall: parseFloat(formData.annualRainfall),
        temperature: parseFloat(formData.temperature),
        last_year_yield: parseFloat(formData.lastYearYield),
        average_yield: parseFloat(formData.averageYield),
        created_at: new Date().toISOString(),
      }

      // Validate numeric values
      if (isNaN(evaluationData.farm_size) || isNaN(evaluationData.soil_ph) || 
          isNaN(evaluationData.annual_rainfall) || isNaN(evaluationData.temperature) || 
          isNaN(evaluationData.last_year_yield) || isNaN(evaluationData.average_yield)) {
        toast({
          title: "Error",
          description: "Invalid numeric values. Please check your inputs.",
          variant: "destructive",
        })
        return
      }

      // Calculate credit score based on the evaluation data
      const creditScore = calculateCreditScore(evaluationData)

      // First, ensure the farmer record exists
      const { data: farmerData, error: farmerError } = await supabase
        .from("farmers")
        .select("id")
        .eq("user_id", user?.id)
        .single()

      let farmerId
      if (farmerError) {
        if (farmerError.code === "PGRST116") {
          // Create farmer record if it doesn't exist
          const { data: newFarmer, error: createError } = await supabase
            .from("farmers")
            .insert([
              {
                user_id: user?.id,
                name: user?.email?.split("@")[0] || "Farmer",
                email: user?.email || "",
                credit_score: creditScore,
                farm_size: evaluationData.farm_size,
                region: evaluationData.region,
              },
            ])
            .select()
            .single()

          if (createError) {
            console.error("Create farmer error:", createError)
            toast({
              title: "Error",
              description: "Failed to create farmer profile. Please try again.",
              variant: "destructive",
            })
            return
          }
          farmerId = newFarmer.id
        } else {
          console.error("Farmer fetch error:", farmerError)
          toast({
            title: "Error",
            description: "Failed to fetch farmer data. Please try again.",
            variant: "destructive",
          })
          return
        }
      } else {
        farmerId = farmerData.id
      }

      // Insert the evaluation data
      const { error: evaluationError } = await supabase
        .from("credit_evaluations")
        .insert([evaluationData])

      if (evaluationError) {
        console.error("Evaluation error:", evaluationError)
        toast({
          title: "Error",
          description: "Failed to save evaluation data. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update farmer's credit score
      const { error: updateError } = await supabase
        .from("farmers")
        .update({
          credit_score: creditScore,
          farm_size: evaluationData.farm_size,
          region: evaluationData.region,
        })
        .eq("id", farmerId)

      if (updateError) {
        console.error("Update error:", updateError)
        toast({
          title: "Error",
          description: "Failed to update credit score. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Add historical data point
      const { error: historicalError } = await supabase
        .from("historical_data")
        .insert([
          {
            farmer_id: farmerId,
            date: new Date().toISOString(),
            credit_score: creditScore,
            soil_health: calculateSoilHealth(evaluationData),
            weather_risk: calculateWeatherRisk(evaluationData),
            past_yields: calculatePastYields(evaluationData),
          },
        ])

      if (historicalError) {
        console.error("Historical data error:", historicalError)
        toast({
          title: "Error",
          description: "Failed to save historical data. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Your credit evaluation has been submitted successfully.",
      })
      router.push("/credit-analysis")
    } catch (error: any) {
      console.error("Error submitting evaluation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions to calculate scores
  const calculateCreditScore = (data: any) => {
    let score = 0
    const maxScore = 100

    // Farm size contribution (up to 20 points)
    if (data.farm_size > 0) {
      score += Math.min(20, data.farm_size / 10)
    }

    // Soil health contribution (up to 30 points)
    if (data.soil_ph > 0) {
      const soilScore = Math.abs(7 - data.soil_ph) // Optimal pH is 7
      score += Math.max(0, 30 - soilScore * 2)
    }

    // Past yields contribution (up to 30 points)
    if (data.average_yield > 0) {
      score += Math.min(30, data.average_yield * 2)
    }

    // Weather risk contribution (up to 20 points)
    if (data.annual_rainfall > 0 && data.temperature > 0) {
      const rainfallScore = Math.min(10, data.annual_rainfall / 100)
      const temperatureScore = Math.min(10, 30 - Math.abs(25 - data.temperature))
      score += rainfallScore + temperatureScore
    }

    return Math.min(maxScore, Math.round(score))
  }

  const calculateSoilHealth = (data: any) => {
    let score = 0
    const maxScore = 100

    // Soil pH contribution (up to 50 points)
    if (data.soil_ph > 0) {
      const pHScore = Math.abs(7 - data.soil_ph)
      score += Math.max(0, 50 - pHScore * 5)
    }

    // Soil type contribution (up to 50 points)
    const soilTypeScores: { [key: string]: number } = {
      loamy: 50,
      silty: 40,
      clay: 30,
      sandy: 20,
    }
    if (data.soil_type) {
      score += soilTypeScores[data.soil_type] || 0
    }

    return Math.min(maxScore, Math.round(score))
  }

  const calculateWeatherRisk = (data: any) => {
    let score = 0
    const maxScore = 100

    // Rainfall contribution (up to 50 points)
    if (data.annual_rainfall > 0) {
      score += Math.min(50, data.annual_rainfall / 20)
    }

    // Temperature contribution (up to 50 points)
    if (data.temperature > 0) {
      const tempScore = 50 - Math.abs(25 - data.temperature) * 2
      score += Math.max(0, tempScore)
    }

    return Math.min(maxScore, Math.round(score))
  }

  const calculatePastYields = (data: any) => {
    let score = 0
    const maxScore = 100

    // Average yield contribution (up to 60 points)
    if (data.average_yield > 0) {
      score += Math.min(60, data.average_yield * 3)
    }

    // Last year's yield contribution (up to 40 points)
    if (data.last_year_yield > 0) {
      const yieldComparison = (data.last_year_yield / data.average_yield) * 40
      score += Math.min(40, yieldComparison)
    }

    return Math.min(maxScore, Math.round(score))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (acres)</Label>
              <Input
                id="farmSize"
                type="number"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">Primary Crop</Label>
              <Select
                value={formData.cropType}
                onValueChange={(value) => setFormData({ ...formData, cropType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select
                value={formData.soilType}
                onValueChange={(value) => setFormData({ ...formData, soilType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="silty">Silty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilPh">Soil pH Level</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[parseFloat(formData.soilPh) || 0]}
                  onValueChange={(value) => setFormData({ ...formData, soilPh: value[0].toString() })}
                  min={0}
                  max={14}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-12 text-center">{formData.soilPh || "0"}</span>
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="annualRainfall">Annual Rainfall (mm)</Label>
              <Input
                id="annualRainfall"
                type="number"
                value={formData.annualRainfall}
                onChange={(e) => setFormData({ ...formData, annualRainfall: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Average Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                required
              />
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="lastYearYield">Last Year's Yield (tons/acre)</Label>
              <Input
                id="lastYearYield"
                type="number"
                value={formData.lastYearYield}
                onChange={(e) => setFormData({ ...formData, lastYearYield: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="averageYield">5-Year Average Yield (tons/acre)</Label>
              <Input
                id="averageYield"
                type="number"
                value={formData.averageYield}
                onChange={(e) => setFormData({ ...formData, averageYield: e.target.value })}
                required
              />
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farm Size:</span>
                  <span className="font-medium">{formData.farmSize} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{formData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crop Type:</span>
                  <span className="font-medium">{formData.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span className="font-medium">{formData.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Soil pH:</span>
                  <span className="font-medium">{formData.soilPh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Rainfall:</span>
                  <span className="font-medium">{formData.annualRainfall} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Temperature:</span>
                  <span className="font-medium">{formData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Year's Yield:</span>
                  <span className="font-medium">{formData.lastYearYield} tons/acre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">5-Year Average Yield:</span>
                  <span className="font-medium">{formData.averageYield} tons/acre</span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Credit Evaluation</h1>
              <p className="text-muted-foreground">
                Complete the form below to get your credit evaluation.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/credit-analysis")}>
              Back to Analysis
            </Button>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index <= currentStep
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index < currentStep ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`w-16 h-0.5 mx-2 ${
                              index < currentStep ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {renderStep()}
                </AnimatePresence>
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Submitting..."
                    ) : currentStep === steps.length - 1 ? (
                      "Submit Evaluation"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 