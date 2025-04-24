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
import { ClientsTableActions } from "@/components/clients-table-actions"
import { ClientDialog } from "@/components/client-dialog"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  programs: string[]
  status: "active" | "inactive"
  lastVisit: string
}

const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    programs: ["Diabetes Management", "Weight Management"],
    status: "active",
    lastVisit: "Apr 23, 2023",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    programs: ["Cardiac Rehabilitation"],
    status: "active",
    lastVisit: "Apr 22, 2023",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    programs: ["Mental Health Support"],
    status: "inactive",
    lastVisit: "Apr 15, 2023",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    programs: ["Prenatal Care", "Nutrition Counseling"],
    status: "active",
    lastVisit: "Apr 20, 2023",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 567-8901",
    programs: ["Diabetes Management"],
    status: "active",
    lastVisit: "Apr 19, 2023",
  },
  {
    id: "6",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "(555) 678-9012",
    programs: ["Weight Management"],
    status: "inactive",
    lastVisit: "Apr 10, 2023",
  },
  {
    id: "7",
    name: "David Taylor",
    email: "david.taylor@example.com",
    phone: "(555) 789-0123",
    programs: ["Cardiac Rehabilitation", "Smoking Cessation"],
    status: "active",
    lastVisit: "Apr 18, 2023",
  },
  {
    id: "8",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    phone: "(555) 890-1234",
    programs: ["Mental Health Support"],
    status: "active",
    lastVisit: "Apr 17, 2023",
  },
  {
    id: "9",
    name: "Christopher Anderson",
    email: "christopher.anderson@example.com",
    phone: "(555) 901-2345",
    programs: ["Physical Therapy"],
    status: "inactive",
    lastVisit: "Apr 5, 2023",
  },
  {
    id: "10",
    name: "Lisa Thomas",
    email: "lisa.thomas@example.com",
    phone: "(555) 012-3456",
    programs: ["Prenatal Care"],
    status: "active",
    lastVisit: "Apr 16, 2023",
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(client.status)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">Manage your clients and their program enrollments</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Clients</CardTitle>
            <CardDescription>View and manage all your clients</CardDescription>
          </div>
          <Button onClick={() => setIsAddClientOpen(true)} className="ml-auto gap-1">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
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
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.programs.length > 0 ? client.programs.join(", ") : "None"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              client.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{client.lastVisit}</TableCell>
                        <TableCell>
                          <ClientsTableActions client={client} />
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

      <ClientDialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen} mode="add" />
    </div>
  )
}
