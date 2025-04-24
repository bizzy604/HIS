import { Suspense } from "react"
import Link from "next/link"
import { Activity, Calendar, ChevronRight, LayoutDashboard, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { EnrollmentChart } from "@/components/enrollment-chart"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Smith. Here's an overview of your practice.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 new programs this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Client Enrollments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 require immediate attention</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Client Enrollment Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly client enrollment across all programs</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto gap-1">
              View Report
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
              <EnrollmentChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest actions and updates</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
              <RecentActivity />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Recent Clients</CardTitle>
              <p className="text-sm text-muted-foreground">Newly registered clients</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/dashboard/clients">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div>
                      <p className="text-sm font-medium">
                        {["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Brown"][i]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered on{" "}
                        {["Apr 23, 2023", "Apr 22, 2023", "Apr 21, 2023", "Apr 20, 2023", "Apr 19, 2023"][i]}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Popular Programs</CardTitle>
              <p className="text-sm text-muted-foreground">Programs with highest enrollment</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/dashboard/programs">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Diabetes Management",
                "Cardiac Rehabilitation",
                "Weight Management",
                "Mental Health Support",
                "Prenatal Care",
              ].map((program, i) => (
                <div key={i} className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium">{program}</p>
                    <p className="text-xs text-muted-foreground">{[124, 98, 87, 76, 65][i]} active clients</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
