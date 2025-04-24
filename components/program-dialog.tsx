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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Program, createProgram, updateProgram } from "@/hooks/use-programs"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

// Extended program type to include formatted dates and enrollment count
interface ExtendedProgram extends Program {
  startDateFormatted?: string;
  endDateFormatted?: string;
  enrolledClients?: number;
}

interface ProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  program?: ExtendedProgram
}

// Program form data structure
export interface ProgramData {
  name: string
  description: string
  status: "active" | "inactive"
  startDate: string
  endDate: string | null
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["active", "inactive"]),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  // End date is optional
  endDate: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ProgramDialog({ open, onOpenChange, mode, program }: ProgramDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format dates for form inputs (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return format(date, "yyyy-MM-dd")
    } catch (error) {
      console.error("Invalid date:", dateString)
      return ""
    }
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: program?.name || "",
      description: program?.description || "",
      status: (program?.status as "active" | "inactive") || "active",
      startDate: formatDateForInput(program?.startDate) || "",
      endDate: formatDateForInput(program?.endDate) || "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    
    try {
      const programData: ProgramData = {
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate || null,
      }
      
      if (mode === "add") {
        // Create new program
        await createProgram(programData)
        toast({
          title: "Success",
          description: "Program has been created successfully",
        })
      } else if (mode === "edit" && program) {
        // Update existing program
        await updateProgram(program.id, programData)
        toast({
          title: "Success",
          description: "Program has been updated successfully",
        })
      }
      
      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting program form:", error)
      // Error handling is done in the API functions
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Program" : "Edit Program"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new health program to your practice."
              : "Edit program details. Fill out the form below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter program description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "add" ? "Add Program" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
