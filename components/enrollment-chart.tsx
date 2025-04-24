"use client"

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

interface EnrollmentChartProps {
  data?: Array<{
    month: string;
    count: number;
  }>;
}

export function EnrollmentChart({ data = defaultData }: EnrollmentChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
