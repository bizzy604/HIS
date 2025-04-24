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
import { Client, deleteClient } from "@/hooks/use-clients"
import { toast } from "@/hooks/use-toast"

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
}

export function DeleteClientDialog({ open, onOpenChange, client }: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      // Call the API to delete the client
      await deleteClient(client.id);
      
      toast({
        title: "Success",
        description: "Client has been deleted successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting client:", error);
      // Error handling is done in the deleteClient function
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{client.name}</span> and remove their data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
