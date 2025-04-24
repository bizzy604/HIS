"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 145 },
  { month: "Mar", enrollments: 162 },
  { month: "Apr", enrollments: 175 },
  { month: "May", enrollments: 198 },
  { month: "Jun", enrollments: 217 },
  { month: "Jul", enrollments: 240 },
  { month: "Aug", enrollments: 265 },
  { month: "Sep", enrollments: 290 },
  { month: "Oct", enrollments: 310 },
  { month: "Nov", enrollments: 325 },
  { month: "Dec", enrollments: 342 },
]

export function EnrollmentChart() {
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
          <Area type="monotone" dataKey="enrollments" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorEnrollments)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
