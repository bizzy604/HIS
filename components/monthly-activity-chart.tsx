"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Default data in case API data is not provided
const defaultData = [
  { month: "Jan", count: 0 },
  { month: "Feb", count: 0 },
  { month: "Mar", count: 0 },
  { month: "Apr", count: 0 },
  { month: "May", count: 0 },
  { month: "Jun", count: 0 },
  { month: "Jul", count: 0 },
  { month: "Aug", count: 0 },
  { month: "Sep", count: 0 },
  { month: "Oct", count: 0 },
  { month: "Nov", count: 0 },
  { month: "Dec", count: 0 },
]

interface MonthlyActivityChartProps {
  data?: Array<{
    month: string;
    count: number;
  }>;
}

export function MonthlyActivityChart({ data = defaultData }: MonthlyActivityChartProps) {
  const chartData = data?.length ? data : defaultData;
  
  // Transform the data to include estimated completions and dropouts
  // In a real implementation, this would come from the API
  const transformedData = chartData.map(item => ({
    month: item.month,
    enrollments: item.count,
    completions: Math.round(item.count * 0.65), // Estimate: 65% completion rate
    dropouts: Math.round(item.count * 0.15), // Estimate: 15% dropout rate
  }));
  
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="enrollments" fill="#4ade80" name="Enrollments" />
          <Bar dataKey="completions" fill="#60a5fa" name="Completions" />
          <Bar dataKey="dropouts" fill="#f87171" name="Dropouts" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
