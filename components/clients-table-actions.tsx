"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClientDialog } from "@/components/client-dialog"
import { DeleteClientDialog } from "@/components/delete-client-dialog"
import { EnrollClientDialog } from "@/components/enroll-client-dialog"
import { Client } from "@/hooks/use-clients"

interface ClientsTableActionsProps {
  client: Client
}

export function ClientsTableActions({ client }: ClientsTableActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEnrollOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Enroll in Program
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientDialog client={client} open={isEditOpen} onOpenChange={setIsEditOpen} mode="edit" />
      <DeleteClientDialog client={client} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
      <EnrollClientDialog client={client} open={isEnrollOpen} onOpenChange={setIsEnrollOpen} />
    </>
  )
}
