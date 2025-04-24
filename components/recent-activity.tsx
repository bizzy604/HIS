"use client"

import { useState } from "react"
import { Calendar, Clock, FileEdit, Plus, Trash, User, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ActivityType = "client_added" | "program_created" | "client_enrolled" | "client_updated" | "program_deleted"

interface Activity {
  id: string
  type: ActivityType
  user: string
  timestamp: string
  details: string
}

const activityData: Activity[] = [
  {
    id: "1",
    type: "client_added",
    user: "Dr. Smith",
    timestamp: "2 hours ago",
    details: "Added new client Sarah Johnson",
  },
  {
    id: "2",
    type: "program_created",
    user: "Dr. Smith",
    timestamp: "3 hours ago",
    details: "Created new program Hypertension Management",
  },
  {
    id: "3",
    type: "client_enrolled",
    user: "Dr. Wilson",
    timestamp: "5 hours ago",
    details: "Enrolled Michael Brown in Diabetes Management",
  },
  {
    id: "4",
    type: "client_updated",
    user: "Dr. Smith",
    timestamp: "Yesterday",
    details: "Updated client information for Emily Davis",
  },
  {
    id: "5",
    type: "program_deleted",
    user: "Dr. Wilson",
    timestamp: "Yesterday",
    details: "Removed outdated Smoking Cessation program",
  },
  {
    id: "6",
    type: "client_added",
    user: "Dr. Smith",
    timestamp: "2 days ago",
    details: "Added new client Robert Johnson",
  },
  {
    id: "7",
    type: "client_enrolled",
    user: "Dr. Wilson",
    timestamp: "2 days ago",
    details: "Enrolled Jane Smith in Mental Health Support",
  },
]

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "client_added":
      return <UserPlus className="h-4 w-4" />
    case "program_created":
      return <Plus className="h-4 w-4" />
    case "client_enrolled":
      return <Calendar className="h-4 w-4" />
    case "client_updated":
      return <FileEdit className="h-4 w-4" />
    case "program_deleted":
      return <Trash className="h-4 w-4" />
    default:
      return <User className="h-4 w-4" />
  }
}

const getActivityColor = (type: ActivityType) => {
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
    default:
      return "bg-gray-500"
  }
}

export function RecentActivity() {
  const [activities] = useState<Activity[]>(activityData)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div
              className={cn("flex h-8 w-8 items-center justify-center rounded-full", getActivityColor(activity.type))}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.details}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{activity.user}</span>
                <span className="mx-1">•</span>
                <Clock className="mr-1 h-3 w-3" />
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full">
        View All Activity
      </Button>
    </div>
  )
}
