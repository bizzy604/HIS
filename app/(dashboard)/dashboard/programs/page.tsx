"use client"

import { useState } from "react"
import { ChevronDown, Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProgramsTableActions } from "@/components/programs-table-actions"
import { ProgramDialog } from "@/components/program-dialog"

interface Program {
  id: string
  name: string
  description: string
  enrolledClients: number
  status: "active" | "inactive"
  startDate: string
  endDate: string
}

const programs: Program[] = [
  {
    id: "1",
    name: "Diabetes Management",
    description: "Comprehensive program for managing diabetes",
    enrolledClients: 124,
    status: "active",
    startDate: "Jan 15, 2023",
    endDate: "Dec 31, 2023",
  },
  {
    id: "2",
    name: "Cardiac Rehabilitation",
    description: "Recovery program for heart patients",
    enrolledClients: 98,
    status: "active",
    startDate: "Feb 1, 2023",
    endDate: "Jan 31, 2024",
  },
  {
    id: "3",
    name: "Weight Management",
    description: "Program for healthy weight loss and maintenance",
    enrolledClients: 87,
    status: "active",
    startDate: "Mar 10, 2023",
    endDate: "Mar 10, 2024",
  },
  {
    id: "4",
    name: "Mental Health Support",
    description: "Support program for mental health and wellness",
    enrolledClients: 76,
    status: "active",
    startDate: "Apr 5, 2023",
    endDate: "Apr 5, 2024",
  },
  {
    id: "5",
    name: "Prenatal Care",
    description: "Care program for expectant mothers",
    enrolledClients: 65,
    status: "active",
    startDate: "May 1, 2023",
    endDate: "May 1, 2024",
  },
  {
    id: "6",
    name: "Nutrition Counseling",
    description: "Guidance for healthy eating habits",
    enrolledClients: 54,
    status: "active",
    startDate: "Jun 15, 2023",
    endDate: "Jun 15, 2024",
  },
  {
    id: "7",
    name: "Physical Therapy",
    description: "Rehabilitation program for physical injuries",
    enrolledClients: 43,
    status: "active",
    startDate: "Jul 1, 2023",
    endDate: "Jul 1, 2024",
  },
  {
    id: "8",
    name: "Smoking Cessation",
    description: "Program to help quit smoking",
    enrolledClients: 32,
    status: "inactive",
    startDate: "Aug 10, 2023",
    endDate: "Feb 10, 2024",
  },
  {
    id: "9",
    name: "Hypertension Management",
    description: "Program for managing high blood pressure",
    enrolledClients: 21,
    status: "active",
    startDate: "Sep 5, 2023",
    endDate: "Sep 5, 2024",
  },
]

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(program.status)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Program Management</h1>
        <p className="text-muted-foreground">Manage your health programs and client enrollments</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Programs</CardTitle>
            <CardDescription>View and manage all your health programs</CardDescription>
          </div>
          <Button onClick={() => setIsAddProgramOpen(true)} className="ml-auto gap-1">
            <Plus className="h-4 w-4" />
            Add Program
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("active")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, "active"])
                        } else {
                          setStatusFilter(statusFilter.filter((s) => s !== "active"))
                        }
                      }}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("inactive")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, "inactive"])
                        } else {
                          setStatusFilter(statusFilter.filter((s) => s !== "inactive"))
                        }
                      }}
                    >
                      Inactive
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Enrolled Clients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No programs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>{program.description}</TableCell>
                        <TableCell>{program.enrolledClients}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              program.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{program.startDate}</TableCell>
                        <TableCell>{program.endDate}</TableCell>
                        <TableCell>
                          <ProgramsTableActions program={program} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProgramDialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen} mode="add" />
    </div>
  )
}
