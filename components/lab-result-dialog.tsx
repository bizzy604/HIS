"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface LabResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labOrder: {
    id: string;
    testName: string;
    testCategory?: string;
    priority: string;
    status: string;
    notes?: string;
    medicalVisit: {
      client: {
        mrn: string;
        name: string;
        dateOfBirth: string;
      };
      doctor: {
        name: string;
        specialization?: string;
      };
    };
    results: {
      id: string;
      parameter: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      isAbnormal: boolean;
      notes?: string;
      verifiedBy?: string;
      verifiedAt?: string;
    }[];
  };
  onSuccess: () => void;
}

export function LabResultDialog({
  open,
  onOpenChange,
  labOrder,
  onSuccess,
}: LabResultDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isCompleted = labOrder.status === "COMPLETED";
  const latestResult = labOrder.results[0];

  const form = useForm({
    defaultValues: {
      parameter: latestResult?.parameter || "",
      value: latestResult?.value || "",
      unit: latestResult?.unit || "",
      referenceRange: latestResult?.referenceRange || "",
      notes: "",
      verifiedBy: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (isCompleted) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      // Determine if the value is abnormal based on comparison
      const isAbnormal = data.value && data.referenceRange ? 
        !data.referenceRange.includes(data.value) : false;

      const response = await fetch(`/api/lab-orders/${labOrder.id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameter: data.parameter,
          value: data.value,
          unit: data.unit,
          referenceRange: data.referenceRange,
          isAbnormal,
          notes: data.notes,
          verifiedBy: data.verifiedBy,
        }),
      });

      if (response.ok) {
        toast.success("Lab results saved successfully");
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save results");
      }
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("Failed to save results");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCompleted ? "Lab Results" : "Enter Lab Results"}
          </DialogTitle>
          <DialogDescription>
            {isCompleted ? "View test results" : "Enter and save test results"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium">
                  {labOrder.medicalVisit.client.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">MRN:</span>
                <span className="ml-2 font-mono">{labOrder.medicalVisit.client.mrn}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Age:</span>
                <span className="ml-2">{calculateAge(labOrder.medicalVisit.client.dateOfBirth)} years</span>
              </div>
              <div>
                <span className="text-muted-foreground">Ordered By:</span>
                <span className="ml-2">{labOrder.medicalVisit.doctor.name}</span>
              </div>
            </div>
          </div>

          {/* Test Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <h3 className="font-semibold text-sm">Test Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Test Name:</span>
                <span className="ml-2 font-medium">{labOrder.testName}</span>
              </div>
              {labOrder.testCategory && (
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2">{labOrder.testCategory}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-2">
                  {labOrder.priority === "STAT" && <Badge variant="destructive">STAT</Badge>}
                  {labOrder.priority === "URGENT" && <Badge variant="secondary">Urgent</Badge>}
                  {labOrder.priority === "ROUTINE" && <Badge variant="outline">Routine</Badge>}
                </span>
              </div>
              {labOrder.notes && (
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <span className="ml-2">{labOrder.notes}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Results Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="parameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Hemoglobin, Blood Sugar"
                        disabled={isCompleted}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 12.5"
                          disabled={isCompleted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., g/dL, mg/dL"
                          disabled={isCompleted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="referenceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Range</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 12-16 g/dL"
                        disabled={isCompleted}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Clinical notes or observations"
                        rows={3}
                        disabled={isCompleted}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isCompleted && (
                <FormField
                  control={form.control}
                  name="verifiedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verified By</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of lab technician" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {isCompleted ? "Close" : "Cancel"}
                </Button>
                {!isCompleted && (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Results"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

