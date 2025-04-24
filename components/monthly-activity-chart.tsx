"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    month: "Jan",
    enrollments: 65,
    completions: 38,
    dropouts: 5,
  },
  {
    month: "Feb",
    enrollments: 78,
    completions: 42,
    dropouts: 8,
  },
  {
    month: "Mar",
    enrollments: 90,
    completions: 45,
    dropouts: 10,
  },
  {
    month: "Apr",
    enrollments: 81,
    completions: 50,
    dropouts: 7,
  },
  {
    month: "May",
    enrollments: 95,
    completions: 48,
    dropouts: 12,
  },
  {
    month: "Jun",
    enrollments: 110,
    completions: 55,
    dropouts: 9,
  },
  {
    month: "Jul",
    enrollments: 120,
    completions: 60,
    dropouts: 11,
  },
  {
    month: "Aug",
    enrollments: 130,
    completions: 65,
    dropouts: 14,
  },
  {
    month: "Sep",
    enrollments: 115,
    completions: 70,
    dropouts: 10,
  },
  {
    month: "Oct",
    enrollments: 105,
    completions: 75,
    dropouts: 8,
  },
  {
    month: "Nov",
    enrollments: 95,
    completions: 68,
    dropouts: 7,
  },
  {
    month: "Dec",
    enrollments: 85,
    completions: 72,
    dropouts: 6,
  },
]

export function MonthlyActivityChart() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
