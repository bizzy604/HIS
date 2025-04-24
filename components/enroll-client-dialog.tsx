"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Client } from "@/hooks/use-clients"
import { usePrograms } from "@/hooks/use-programs"
import { createEnrollment } from "@/hooks/use-enrollments"
import { toast } from "@/hooks/use-toast"

interface EnrollClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client
}

const formSchema = z.object({
  program: z.string({
    required_error: "Please select a program.",
  }),
  status: z.enum(["active", "completed", "dropped"], {
    required_error: "Please select a status.",
  }),
  notes: z.string().optional(),
})

export function EnrollClientDialog({ open, onOpenChange, client }: EnrollClientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { programs, isLoading: isLoadingPrograms } = usePrograms()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program: "",
      status: "active",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoadingPrograms || !programs.length) {
      toast({
        title: "Error",
        description: "Unable to load programs. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create the enrollment
      await createEnrollment({
        clientId: client.id,
        programId: values.program,
        status: values.status,
      })

      toast({
        title: "Success",
        description: `${client.name} has been enrolled in the program successfully.`,
      })

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error enrolling client:", error)
      // Error handling is done in the createEnrollment function
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll in Program</DialogTitle>
          <DialogDescription>
            Enroll {client.name} in a health program. Select a program from the list below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingPrograms ? (
                        <SelectItem value="loading" disabled>
                          Loading programs...
                        </SelectItem>
                      ) : programs.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No programs available
                        </SelectItem>
                      ) : (
                        programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this enrollment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingPrograms}>
                {isSubmitting ? "Enrolling..." : "Enroll Client"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
