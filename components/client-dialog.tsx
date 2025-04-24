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
import { Client, ClientData, createClient, updateClient } from "@/hooks/use-clients"
import { toast } from "@/hooks/use-toast"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  client?: Client
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  status: z.enum(["active", "inactive"]),
})

type FormValues = z.infer<typeof formSchema>

export function ClientDialog({ open, onOpenChange, mode, client }: ClientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      status: (client?.status as "active" | "inactive") || "active",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const clientData: ClientData = {
        name: values.name,
        email: values.email || "",
        phone: values.phone || "",
        status: values.status
      };

      if (mode === "add") {
        // Create new client
        await createClient(clientData);
        toast({
          title: "Success",
          description: "Client has been created successfully",
        });
      } else if (mode === "edit" && client) {
        // Update existing client
        await updateClient(client.id, clientData);
        toast({
          title: "Success",
          description: "Client has been updated successfully",
        });
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting client form:", error);
      // Error handling is done in the API functions
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Client" : "Edit Client"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new client to your practice. Fill out the form below."
              : "Edit client details. Fill out the form below."}
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
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client email" type="email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client phone" {...field} value={field.value || ''} />
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
                {isSubmitting ? "Saving..." : mode === "add" ? "Add Client" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
