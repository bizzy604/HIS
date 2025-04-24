"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Program {
  id: string
  name: string
  description: string
  enrolledClients: number
  status: "active" | "inactive"
  startDate: string
  endDate: string
}

interface DeleteProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: Program
}

export function DeleteProgramDialog({ open, onOpenChange, program }: DeleteProgramDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    // In a real application, you would delete from your API here
    console.log(`Deleting program: ${program.id}`)

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-semibold">{program.name}</span> program and remove all client enrollments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
