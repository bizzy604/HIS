import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Simple dashboard layout wrapper - middleware handles auth checks
export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
