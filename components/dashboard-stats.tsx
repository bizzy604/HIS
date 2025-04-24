"use client";

import { useEffect, useState } from "react";
import { Activity, Calendar, LayoutDashboard, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsData = {
  counts: {
    totalClients: number;
    activeClients: number;
    totalPrograms: number;
    activePrograms: number;
    totalEnrollments: number;
  };
  enrollmentRate: number;
  completionRate: number;
  monthlyEnrollments: { month: string; count: number }[];
  programDistribution: { name: string; value: number }[];
  clientStatusDistribution: { name: string; value: number }[];
  recentActivity: any[];
};

export function DashboardStats() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/analytics?startDate=" + new Date().toISOString().split("T")[0]);
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`);
        }
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.counts.totalClients.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.counts.activeClients} active clients
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.counts.activePrograms.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.counts.totalPrograms} total programs
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Client Enrollments</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.counts.totalEnrollments.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {data.enrollmentRate.toFixed(1)}% enrollment rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Program completion rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
