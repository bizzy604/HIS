"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown, Download, Filter } from "lucide-react"
import { format } from "date-fns"

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
import { cn } from "@/lib/utils"
import { EnrollmentChart } from "@/components/enrollment-chart"
import { ProgramDistributionChart } from "@/components/program-distribution-chart"
import { ClientStatusChart } from "@/components/client-status-chart"
import { MonthlyActivityChart } from "@/components/monthly-activity-chart"

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [programFilter, setProgramFilter] = useState<string[]>([])

  const programs = [
    "Diabetes Management",
    "Cardiac Rehabilitation",
    "Weight Management",
    "Mental Health Support",
    "Prenatal Care",
  ]

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
              {programs.map((program) => (
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
              ))}
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
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 new programs this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Enrollment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.3%</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-muted-foreground">+4.3% from last month</p>
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
                <EnrollmentChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Program Distribution</CardTitle>
                <CardDescription>Client distribution across programs</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgramDistributionChart />
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
              <div className="space-y-8">
                {programs.map((program, i) => (
                  <div key={program} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{program}</p>
                        <p className="text-sm text-muted-foreground">{[124, 98, 87, 76, 65][i]} enrolled clients</p>
                      </div>
                      <div className="text-sm text-right">
                        <p className="font-medium">{[82, 75, 68, 79, 85][i]}% completion rate</p>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-red-500"][i],
                        )}
                        style={{
                          width: `${[82, 75, 68, 79, 85][i]}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Status</CardTitle>
                <CardDescription>Distribution of client status across all programs</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientStatusChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Client Demographics</CardTitle>
                <CardDescription>Age and gender distribution of clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Age Groups</p>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {["18-30", "31-40", "41-50", "51-60", "60+"].map((age, i) => (
                        <div key={age} className="space-y-2">
                          <div className="h-20 w-full rounded-md bg-muted">
                            <div
                              className="h-full rounded-md bg-primary"
                              style={{
                                height: `${[30, 45, 70, 85, 60][i]}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-center">{age}</p>
                          <p className="text-xs text-center font-medium">{[15, 22, 35, 42, 30][i]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Gender</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded-full bg-muted">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: "45%" }} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <p>Male</p>
                          <p className="font-medium">45%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded-full bg-muted">
                          <div className="h-full rounded-full bg-pink-500" style={{ width: "55%" }} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <p>Female</p>
                          <p className="font-medium">55%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Client enrollments, completions, and dropouts</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyActivityChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
