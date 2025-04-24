"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Program {
  id: string
  name: string
  description: string
  enrolledClients: number
  status: "active" | "inactive"
  startDate: string
  endDate: string
}

interface ViewEnrolledClientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: Program
}

interface EnrolledClient {
  id: string
  name: string
  email: string
  enrollmentDate: string
  status: "active" | "completed" | "dropped"
}

// Mock data for enrolled clients
const getEnrolledClients = (programId: string): EnrolledClient[] => {
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      enrollmentDate: "Jan 20, 2023",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      enrollmentDate: "Feb 5, 2023",
      status: "active",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      enrollmentDate: "Mar 15, 2023",
      status: "dropped",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      enrollmentDate: "Apr 10, 2023",
      status: "active",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      enrollmentDate: "May 1, 2023",
      status: "active",
    },
  ]
}

export function ViewEnrolledClientsDialog({ open, onOpenChange, program }: ViewEnrolledClientsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const enrolledClients = getEnrolledClients(program.id)

  const filteredClients = enrolledClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Enrolled Clients</DialogTitle>
          <DialogDescription>Clients enrolled in the {program.name} program</DialogDescription>
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
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No clients found.
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
