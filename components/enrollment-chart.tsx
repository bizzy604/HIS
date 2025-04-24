"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function EnrollmentChart() {
  const [chartData, setChartData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      try {
        setIsLoading(true)
        // Get data for the last 12 months
        const today = new Date()
        const oneYearAgo = new Date(today)
        oneYearAgo.setFullYear(today.getFullYear() - 1)
        
        const response = await fetch(`/api/analytics?startDate=${oneYearAgo.toISOString().split("T")[0]}&endDate=${today.toISOString().split("T")[0]}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.monthlyEnrollments && Array.isArray(data.monthlyEnrollments)) {
          // Format the API data for the chart
          const formattedData = data.monthlyEnrollments.map((item: any) => {
            const date = new Date(item.month)
            return {
              month: months[date.getMonth()],
              count: item.count
            }
          })
          
          setChartData(formattedData)
        }
      } catch (err) {
        console.error("Error fetching enrollment data:", err)
        setError("Failed to load enrollment chart data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (isLoading) {
    return <div>Loading chart data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorEnrollments)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
