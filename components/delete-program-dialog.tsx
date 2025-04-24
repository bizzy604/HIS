"use client"

import { useState } from "react"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Program, deleteProgram } from "@/hooks/use-programs"
import { toast } from "@/hooks/use-toast"

// Extended program type to include formatted dates and enrollment count
interface ExtendedProgram extends Program {
  startDateFormatted?: string;
  endDateFormatted?: string;
  enrolledClients?: number;
}

interface DeleteProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: ExtendedProgram
}

export function DeleteProgramDialog({ open, onOpenChange, program }: DeleteProgramDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      await deleteProgram(program.id)
      toast({
        title: "Success",
        description: "Program has been deleted successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting program:", error)
      // Error handling is done in the deleteProgram function
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Program</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{program.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-1"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
