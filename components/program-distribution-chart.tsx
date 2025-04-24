"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

// Default data in case API data is not provided
const defaultData = [
  { name: "No Program Data", value: 1 }
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#4CAF50", "#E91E63", "#9C27B0"]

interface ProgramDistributionChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
}

export function ProgramDistributionChart({ data = defaultData }: ProgramDistributionChartProps) {
  const chartData = data?.length ? data : defaultData;
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
