"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProgramDialog } from "@/components/program-dialog"
import { DeleteProgramDialog } from "@/components/delete-program-dialog"
import { ViewEnrolledClientsDialog } from "@/components/view-enrolled-clients-dialog"

interface Program {
  id: string
  name: string
  description: string
  enrolledClients: number
  status: "active" | "inactive"
  startDate: string
  endDate: string
}

interface ProgramsTableActionsProps {
  program: Program
}

export function ProgramsTableActions({ program }: ProgramsTableActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewClientsOpen, setIsViewClientsOpen] = useState(false)

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
            Edit Program
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsViewClientsOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            View Enrolled Clients
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete Program
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProgramDialog open={isEditOpen} onOpenChange={setIsEditOpen} mode="edit" program={program} />

      <DeleteProgramDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} program={program} />

      <ViewEnrolledClientsDialog open={isViewClientsOpen} onOpenChange={setIsViewClientsOpen} program={program} />
    </>
  )
}
