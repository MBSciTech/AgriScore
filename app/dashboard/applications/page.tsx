"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { getCreditApplications, type CreditApplication } from "@/app/actions/credit-application"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<CreditApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      if (user) {
        try {
          const data = await getCreditApplications(user.id)
          setApplications(data)
        } catch (error) {
          console.error("Error loading applications:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadApplications()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>You need to be logged in to view your applications.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </CardFooter>
          </Card>
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
              <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
              <p className="text-muted-foreground">View and manage your credit applications</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/apply">New Application</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>No Applications Found</CardTitle>
                <CardDescription>You haven't submitted any credit applications yet.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/dashboard/apply">Apply for Credit</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <Card key={application.id} className="glassmorphism">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">${application.loan_amount.toLocaleString()}</CardTitle>
                      <Badge
                        variant={
                          application.status === "approved"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {application.loan_purpose.charAt(0).toUpperCase() + application.loan_purpose.slice(1)} -{" "}
                      {application.loan_term} months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{application.farm_name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{new Date(application.created_at as string).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/dashboard/applications/${application.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

