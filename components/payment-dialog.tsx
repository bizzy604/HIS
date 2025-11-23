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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billing: {
    id: string;
    billNumber: string;
    totalAmount: number;
    status: string;
    paidAmount?: number;
    client: {
      firstName: string;
      lastName: string;
      mrn: string;
    };
    items: {
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    subtotal: number;
    discount: number;
    tax: number;
  };
  onSuccess: () => void;
}

const paymentMethods = ["CASH", "CARD", "INSURANCE", "MOBILE_MONEY", "BANK_TRANSFER"];

export function PaymentDialog({
  open,
  onOpenChange,
  billing,
  onSuccess,
}: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isPaid = billing.status === "PAID";
  const remainingAmount = billing.totalAmount - (billing.paidAmount || 0);

  const form = useForm({
    defaultValues: {
      paidAmount: remainingAmount.toString(),
      paymentMethod: "CASH",
    },
  });

  const onSubmit = async (data: any) => {
    if (isPaid) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      const paidAmount = parseFloat(data.paidAmount);
      const totalPaid = (billing.paidAmount || 0) + paidAmount;
      
      let status = "PAID";
      if (totalPaid < billing.totalAmount) {
        status = "PARTIAL";
      }

      const response = await fetch(`/api/billing/${billing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentMethod: data.paymentMethod,
          paidAmount: totalPaid,
        }),
      });

      if (response.ok) {
        toast.success("Payment recorded successfully");
        form.reset();
        onOpenChange(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to record payment");
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isPaid ? "Payment Details" : "Record Payment"}
          </DialogTitle>
          <DialogDescription>
            Bill #{billing.billNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-sm mb-2">Patient</h3>
            <p className="text-sm">
              {billing.client.firstName} {billing.client.lastName} - {billing.client.mrn}
            </p>
          </div>

          {/* Bill Items */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-sm mb-3">Bill Items</h3>
            <div className="space-y-2">
              {billing.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.description} × {item.quantity}
                  </span>
                  <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${billing.subtotal.toFixed(2)}</span>
              </div>
              
              {billing.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${billing.discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Tax (15%)</span>
                <span>${billing.tax.toFixed(2)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>${billing.totalAmount.toFixed(2)}</span>
              </div>

              {billing.paidAmount && billing.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Paid Amount</span>
                    <span>${billing.paidAmount.toFixed(2)}</span>
                  </div>
                  {!isPaid && (
                    <div className="flex justify-between font-semibold text-orange-600">
                      <span>Balance Due</span>
                      <span>${remainingAmount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Form */}
          {!isPaid && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Amount*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
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
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Recording..." : "Record Payment"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {isPaid && (
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
