"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CalendarIcon, ChevronDown, Download, Filter } from "lucide-react"
import { format, subMonths } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { EnrollmentChart } from "@/components/enrollment-chart"
import { ProgramDistributionChart } from "@/components/program-distribution-chart"
import { ClientStatusChart } from "@/components/client-status-chart"
import { MonthlyActivityChart } from "@/components/monthly-activity-chart"
import { useAnalytics } from "@/hooks/use-analytics"
import { usePrograms } from "@/hooks/use-programs"

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to 6 months ago
    return format(subMonths(new Date(), 6), "yyyy-MM-dd")
  })
  const [programFilter, setProgramFilter] = useState<string[]>([])
  
  const { analytics, isLoading: isLoadingAnalytics, isError: isAnalyticsError } = useAnalytics(startDate)
  const { programs: programsData, isLoading: isLoadingPrograms } = usePrograms()
  
  // Get program names for the filter
  const programs = programsData.map(program => program.name)
  
  // Format percentages
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }
  
  // Handle date selection for filtering
  useEffect(() => {
    if (date) {
      setStartDate(format(date, "yyyy-MM-dd"))
    }
  }, [date])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Analyze client enrollments and program performance</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Programs
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Program</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoadingPrograms ? (
                <div className="px-2 py-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-full" />
                </div>
              ) : (
                programs.map((program) => (
                  <DropdownMenuCheckboxItem
                    key={program}
                    checked={programFilter.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProgramFilter([...programFilter, program])
                      } else {
                        setProgramFilter(programFilter.filter((p) => p !== program))
                      }
                    }}
                  >
                    {program}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {isAnalyticsError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{analytics?.counts.totalClients || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {analytics?.counts.activeClients || 0} active clients
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{analytics?.counts.activePrograms || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        Out of {analytics?.counts.totalPrograms || 0} total programs
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Enrollment Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{formatPercentage(analytics?.enrollmentRate || 0)}</div>
                      <p className="text-xs text-muted-foreground">
                        {analytics?.counts.totalEnrollments || 0} total enrollments
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{formatPercentage(analytics?.completionRate || 0)}</div>
                      <p className="text-xs text-muted-foreground">
                        Programs completed successfully
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
                  <CardDescription>Monthly client enrollment across all programs</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <EnrollmentChart data={analytics?.monthlyEnrollments} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Program Distribution</CardTitle>
                  <CardDescription>Client distribution across programs</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <ProgramDistributionChart data={analytics?.programDistribution} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
                <CardDescription>Enrollment and completion rates by program</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics || isLoadingPrograms ? (
                  <div className="space-y-8">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : analytics?.programDistribution && analytics.programDistribution.length > 0 ? (
                  <div className="space-y-8">
                    {analytics.programDistribution.map((program, i) => (
                      <div key={program.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{program.name}</p>
                            <p className="text-sm text-muted-foreground">{program.value} enrolled clients</p>
                          </div>
                          <div className="text-sm text-right">
                            <p className="font-medium">
                              {/* Placeholder for completion rate, in a real app this would come from the API */}
                              {Math.floor(70 + Math.random() * 20)}% completion rate
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-red-500"][i % 5],
                              `w-[${Math.floor(70 + Math.random() * 20)}%]`
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No program data available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Status Distribution</CardTitle>
                  <CardDescription>Breakdown of clients by status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ClientStatusChart data={analytics?.clientStatusDistribution} />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Client Demographics</CardTitle>
                  <CardDescription>Breakdown of clients by demographic data</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAnalytics ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-sm text-muted-foreground">Demographic data is not available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Client Engagement</CardTitle>
                <CardDescription>Engagement metrics for clients</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-primary">
                        {formatPercentage(analytics?.enrollmentRate || 0)}
                      </div>
                      <div className="mt-2 text-sm font-medium">Enrollment Rate</div>
                      <div className="text-xs text-muted-foreground">
                        Percentage of clients enrolled in at least one program
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-primary">
                        {formatPercentage(analytics?.completionRate || 0)}
                      </div>
                      <div className="mt-2 text-sm font-medium">Completion Rate</div>
                      <div className="text-xs text-muted-foreground">
                        Percentage of enrolled clients who completed programs
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-primary">
                        {analytics?.counts.activeClients || 0}
                      </div>
                      <div className="mt-2 text-sm font-medium">Active Clients</div>
                      <div className="text-xs text-muted-foreground">
                        Number of clients with active program participation
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-primary">
                        {analytics?.counts.totalEnrollments || 0}
                      </div>
                      <div className="mt-2 text-sm font-medium">Total Enrollments</div>
                      <div className="text-xs text-muted-foreground">
                        Total number of program enrollments
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Client enrollments and completions by month</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <MonthlyActivityChart data={analytics?.monthlyEnrollments} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest client enrollments and program completions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-md border p-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    ))}
                  </div>
                ) : analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xl font-bold text-primary">
                            {activity.clientName?.charAt(0) || "C"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.clientName || "Client"}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action}: {activity.programName || "Program"}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.date ? format(new Date(activity.date), "MMM d, yyyy") : "Recent"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No recent activity found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
