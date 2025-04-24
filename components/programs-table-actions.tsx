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
import { Program } from "@/hooks/use-programs"

// Extended program type to include formatted dates and enrollment count 
// that we compute in the programs page
interface ExtendedProgram extends Program {
  startDateFormatted?: string;
  endDateFormatted?: string;
  enrolledClients?: number;
}

interface ProgramsTableActionsProps {
  program: ExtendedProgram
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
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsViewClientsOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            View Enrolled Clients
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* We explicitly pass the required components their appropriate types */}
      {isEditOpen && (
        <ProgramDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          mode="edit"
          program={program}
        />
      )}

      {isDeleteOpen && (
        <DeleteProgramDialog 
          open={isDeleteOpen} 
          onOpenChange={setIsDeleteOpen} 
          program={program} 
        />
      )}

      {isViewClientsOpen && (
        <ViewEnrolledClientsDialog
          open={isViewClientsOpen}
          onOpenChange={setIsViewClientsOpen}
          program={program}
        />
      )}
    </>
  )
}
