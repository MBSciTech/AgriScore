"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { submitApplication } from "./submit-application"
import { toast } from "@/components/ui/use-toast"

export default function ApplyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("loan-details")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check for error parameter in URL
  const error = searchParams.get("error")

  if (error === "submission-failed") {
    toast({
      title: "Application submission failed",
      description: "There was an error submitting your application. Please try again.",
      variant: "destructive",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>You need to be logged in to apply for credit.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("userId", user.id)

      await submitApplication(formData)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Application submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Apply for Credit</h1>
            <p className="text-muted-foreground">
              Complete the application form to request a loan based on your credit evaluation.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loan-details">Loan Details</TabsTrigger>
                <TabsTrigger value="farm-info">Farm Information</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="loan-details" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>Loan Request Details</CardTitle>
                    <CardDescription>Provide information about the loan you're requesting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-amount">Loan Amount (USD)</Label>
                      <Input id="loan-amount" name="loan-amount" type="number" placeholder="e.g., 10000" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-purpose">Loan Purpose</Label>
                      <Select name="loan-purpose" required>
                        <SelectTrigger id="loan-purpose">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equipment">Farm Equipment</SelectItem>
                          <SelectItem value="seeds">Seeds and Fertilizers</SelectItem>
                          <SelectItem value="irrigation">Irrigation System</SelectItem>
                          <SelectItem value="land">Land Purchase/Lease</SelectItem>
                          <SelectItem value="infrastructure">Farm Infrastructure</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-term">Loan Term (Months)</Label>
                      <Select name="loan-term" required>
                        <SelectTrigger id="loan-term">
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                          <SelectItem value="48">48 months</SelectItem>
                          <SelectItem value="60">60 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-description">Detailed Description</Label>
                      <Textarea
                        id="loan-description"
                        name="loan-description"
                        placeholder="Provide details about how you plan to use the loan..."
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline">
                      Save Draft
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("farm-info")}>
                      Continue to Farm Information
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="farm-info" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>Farm Information</CardTitle>
                    <CardDescription>Provide details about your farm and operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farm-name">Farm Name</Label>
                        <Input id="farm-name" name="farm-name" placeholder="e.g., Green Valley Farm" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farm-size">Farm Size (Acres)</Label>
                        <Input id="farm-size" name="farm-size" type="number" placeholder="e.g., 50" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farm-location">Farm Location</Label>
                      <Input id="farm-location" name="farm-location" placeholder="Full address of your farm" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary-crop">Primary Crops</Label>
                      <Select name="primary-crop" required>
                        <SelectTrigger id="primary-crop">
                          <SelectValue placeholder="Select primary crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="soybeans">Soybeans</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farming-experience">Years of Farming Experience</Label>
                      <Input
                        id="farming-experience"
                        name="farming-experience"
                        type="number"
                        placeholder="e.g., 10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previous-yield">Previous Year's Yield (Tons)</Label>
                      <Input id="previous-yield" name="previous-yield" type="number" placeholder="e.g., 200" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("loan-details")}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("documents")}>
                      Continue to Documents
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                    <CardDescription>Upload the necessary documents to complete your application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id-proof">Identification Proof</Label>
                      <Input id="id-proof" name="id-proof" type="file" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a government-issued ID (passport, driver's license, etc.)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="land-ownership">Land Ownership/Lease Document</Label>
                      <Input id="land-ownership" name="land-ownership" type="file" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload proof of land ownership or lease agreement
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bank-statements">Bank Statements</Label>
                      <Input id="bank-statements" name="bank-statements" type="file" />
                      <p className="text-xs text-muted-foreground mt-1">Upload last 6 months of bank statements</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yield-records">Previous Yield Records</Label>
                      <Input id="yield-records" name="yield-records" type="file" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload documentation of previous crop yields (if available)
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox id="terms" name="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I confirm that all information provided is accurate and complete
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("farm-info")}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

