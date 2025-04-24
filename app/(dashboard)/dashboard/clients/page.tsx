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
import { useClients } from "@/hooks/use-clients"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  
  // Fetch clients using our API hook
  const { clients, isLoading, isError } = useClients()

  // Apply filters to the fetched clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.phone && client.phone.includes(searchQuery))

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(client.status)

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

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
                  {isLoading ? (
                    // Show loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    // Show error state
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Error loading clients. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : filteredClients.length === 0 ? (
                    // Show empty state
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Show client data
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email || '-'}</TableCell>
                        <TableCell>{client.phone || '-'}</TableCell>
                        <TableCell>
                          {client.enrollments && client.enrollments.length > 0 
                            ? client.enrollments.map(e => e.program.name).join(", ") 
                            : "None"}
                        </TableCell>
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
                        <TableCell>{formatDate(client.lastVisit)}</TableCell>
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
