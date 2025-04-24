"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Program } from "@/hooks/use-programs"
import { useEnrollments } from "@/hooks/use-enrollments"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

// Extended program type to include formatted dates and enrollment count
interface ExtendedProgram extends Program {
  startDateFormatted?: string;
  endDateFormatted?: string;
  enrolledClients?: number;
}

interface ViewEnrolledClientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: ExtendedProgram
}

export function ViewEnrolledClientsDialog({ open, onOpenChange, program }: ViewEnrolledClientsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { enrollments, isLoading, isError } = useEnrollments(undefined, program.id)
  
  // Format the client data for display
  const clients = enrollments.map(enrollment => ({
    id: enrollment.client.id,
    name: enrollment.client.name,
    email: enrollment.client.email || "N/A",
    enrollmentDate: format(new Date(enrollment.createdAt), "MMM d, yyyy"),
    status: enrollment.status
  }))
  
  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Clients Enrolled in {program.name}</DialogTitle>
          <DialogDescription>
            View all clients enrolled in this program
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                      </TableRow>
                    ))
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      {isError 
                        ? "Error loading enrolled clients." 
                        : clients.length === 0 
                          ? "No clients are enrolled in this program." 
                          : "No clients found matching your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.enrollmentDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            client.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : client.status === "completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                        >
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
