"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface LabOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicalVisitId: string;
  onSuccess: () => void;
}

const testCategories = [
  "Hematology",
  "Clinical Chemistry",
  "Microbiology",
  "Immunology",
  "Pathology",
  "Radiology",
  "Other",
];

const specimenTypes = [
  "Blood",
  "Urine",
  "Stool",
  "Sputum",
  "CSF",
  "Tissue",
  "Swab",
  "Other",
];

const urgencyLevels = ["ROUTINE", "URGENT", "STAT"];

export function LabOrderDialog({
  open,
  onOpenChange,
  medicalVisitId,
  onSuccess,
}: LabOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      testName: "",
      testCategory: "",
      specimenType: "",
      urgency: "ROUTINE",
      clinicalNotes: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicalVisitId,
          ...data,
        }),
      });

      if (response.ok) {
        toast.success("Lab order created successfully");
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create lab order");
      }
    } catch (error) {
      console.error("Error creating lab order:", error);
      toast.error("Failed to create lab order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Laboratory Test</DialogTitle>
          <DialogDescription>
            Create a new lab order for this patient
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="testName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Complete Blood Count (CBC)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="testCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {testCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specimenType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specimen Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specimen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specimenTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clinicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinical Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Clinical indication, patient history, or special instructions"
                      rows={4}
                      {...field}
                    />
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Lab Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
