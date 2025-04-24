"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileEdit, Plus, Trash, User, UserPlus } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ActivityType = "client_added" | "program_created" | "client_enrolled" | "client_updated" | "program_deleted" | "enrollment_completed"

interface Activity {
  id: string
  type: ActivityType
  clientName?: string
  programName?: string
  status?: string
  createdAt: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/analytics`)
        
        if (!response.ok) {
          throw new Error(`Error fetching analytics: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.recentActivity && Array.isArray(data.recentActivity)) {
          // Transform the API response into our Activity format
          const formattedActivities = data.recentActivity.map((activity: any) => {
            let type: ActivityType = "client_enrolled"
            let details = ""
            
            // Determine the activity type based on available data
            if (activity.client && activity.program) {
              type = "client_enrolled"
            } else if (activity.status === "completed") {
              type = "enrollment_completed"
            }
            
            return {
              id: activity.id,
              type,
              clientName: activity.client?.name,
              programName: activity.program?.name,
              status: activity.status,
              createdAt: activity.createdAt
            }
          })
          
          setActivities(formattedActivities)
        }
      } catch (err) {
        console.error("Error fetching activity data:", err)
        setError("Failed to load recent activity")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  if (isLoading) {
    return <div>Loading recent activity...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (activities.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No recent activity</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className={cn("p-2 rounded-full", getActivityColor(activity.type))}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              {getActivityText(activity)}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.createdAt
                ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "client_added":
      return <UserPlus className="h-4 w-4 text-white" />
    case "program_created":
      return <Plus className="h-4 w-4 text-white" />
    case "client_enrolled":
      return <Calendar className="h-4 w-4 text-white" />
    case "client_updated":
      return <FileEdit className="h-4 w-4 text-white" />
    case "program_deleted":
      return <Trash className="h-4 w-4 text-white" />
    case "enrollment_completed":
      return <Clock className="h-4 w-4 text-white" />
    default:
      return <User className="h-4 w-4 text-white" />
  }
}

function getActivityColor(type: ActivityType) {
  switch (type) {
    case "client_added":
      return "bg-green-500"
    case "program_created":
      return "bg-blue-500"
    case "client_enrolled":
      return "bg-purple-500"
    case "client_updated":
      return "bg-amber-500"
    case "program_deleted":
      return "bg-red-500"
    case "enrollment_completed":
      return "bg-teal-500"
    default:
      return "bg-gray-500"
  }
}

function getActivityText(activity: Activity) {
  switch (activity.type) {
    case "client_enrolled":
      return `${activity.clientName || "A client"} enrolled in ${activity.programName || "a program"}`
    case "enrollment_completed":
      return `${activity.clientName || "A client"} completed ${activity.programName || "a program"}`
    default:
      return `Activity: ${activity.clientName} - ${activity.programName}`
  }
}
