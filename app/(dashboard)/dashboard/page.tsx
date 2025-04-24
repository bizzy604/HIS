import { Suspense } from "react"
import Link from "next/link"
import { Activity, Calendar, ChevronRight, LayoutDashboard, Users } from "lucide-react"
import { getCurrentDoctor } from "@/lib/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { EnrollmentChart } from "@/components/enrollment-chart"
import { RecentActivity } from "@/components/recent-activity"
import { DashboardStats } from "@/components/dashboard-stats"

export default async function DashboardPage() {
  // Fetch the current doctor using our custom auth function
  const doctor = await getCurrentDoctor();
  
  // Get the doctor's name or use a default
  const displayName: string = doctor?.name || "Doctor";
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. {displayName}. Here's an overview of your practice.</p>
      </div>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrollment Trend</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/analytics">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">View Analytics</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<EnrollmentChartSkeleton />}>
              <EnrollmentChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/clients">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">View All</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<RecentActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EnrollmentChartSkeleton() {
  return (
    <div className="w-full space-y-2">
      <div className="h-[200px] w-full rounded-lg bg-muted" />
      <div className="flex items-center justify-center">
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

function RecentActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
