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
import { usePrograms } from "@/hooks/use-programs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"
import { exportToCSV } from "@/lib/csv-export"

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)
  
  const { programs, isLoading, isError } = usePrograms()

  // Format dates and count enrollments
  const formattedPrograms = programs.map(program => ({
    ...program,
    startDateFormatted: format(new Date(program.startDate), 'MMM d, yyyy'),
    endDateFormatted: program.endDate ? format(new Date(program.endDate), 'MMM d, yyyy') : 'Ongoing',
    enrolledClients: program.enrollments?.length || 0
  }))

  const filteredPrograms = formattedPrograms.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (program.description && program.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(program.status)

    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    const exportData = filteredPrograms.map(program => ({
      Name: program.name,
      Description: program.description || '',
      'Enrolled Clients': program.enrolledClients,
      Status: program.status,
      'Start Date': program.startDateFormatted,
      'End Date': program.endDateFormatted,
      Duration: program.duration || '',
      Cost: program.cost || '',
    }));
    exportToCSV(exportData, 'programs');
  };

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
                <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the programs. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
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
                    {isLoading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <TableRow key={`loading-${index}`}>
                            <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[60px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-[60px]" /></TableCell>
                          </TableRow>
                        ))
                    ) : filteredPrograms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No programs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPrograms.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell className="font-medium">{program.name}</TableCell>
                          <TableCell>{program.description || "No description"}</TableCell>
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
                          <TableCell>{program.startDateFormatted}</TableCell>
                          <TableCell>{program.endDateFormatted}</TableCell>
                          <TableCell>
                            <ProgramsTableActions program={program} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProgramDialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen} mode="add" />
    </div>
  )
}
