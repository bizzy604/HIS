"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, DollarSign, FileText, CheckCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingDialog } from "@/components/billing-dialog";
import { PaymentDialog } from "@/components/payment-dialog";

type Billing = {
  id: string;
  billNumber: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  paidAmount?: number;
  paidAt?: string;
  createdAt: string;
  client: {
    id: string;
    mrn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  medicalVisit?: {
    id: string;
    doctor: {
      name: string;
      specialization?: string;
    };
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemType: string;
  }[];
};

export default function BillingPage() {
  const [bills, setBills] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Billing | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing");
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.client.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${bill.client.firstName} ${bill.client.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const pendingBills = filteredBills.filter(
    (bill) => bill.status === "PENDING" || bill.status === "PARTIAL"
  );

  const paidBills = filteredBills.filter((bill) => bill.status === "PAID");

  const totalRevenue = paidBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      PENDING: { variant: "secondary", label: "Pending" },
      PARTIAL: { variant: "default", label: "Partial", className: "bg-yellow-100 text-yellow-800" },
      PAID: { variant: "outline", label: "Paid", className: "bg-green-100 text-green-800" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Manage invoices, payments, and revenue tracking
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bills.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-600">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
              <CheckCircle className="h-4 w-4" />
              Paid Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidBills.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingBills.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidBills.length})</TabsTrigger>
            <TabsTrigger value="all">All Bills ({bills.length})</TabsTrigger>
          </TabsList>
          <Button onClick={() => setBillingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bills & Invoices</CardTitle>
                <CardDescription>View and manage billing records</CardDescription>
              </div>
              <div className="w-72">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by bill number, MRN, or patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="pending" className="mt-0">
              <BillingTable
                bills={pendingBills}
                isLoading={isLoading}
                onPayment={(bill) => {
                  setSelectedBill(bill);
                  setPaymentDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="paid" className="mt-0">
              <BillingTable
                bills={paidBills}
                isLoading={isLoading}
                onPayment={(bill) => {
                  setSelectedBill(bill);
                  setPaymentDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <BillingTable
                bills={filteredBills}
                isLoading={isLoading}
                onPayment={(bill) => {
                  setSelectedBill(bill);
                  setPaymentDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <BillingDialog
        open={billingDialogOpen}
        onOpenChange={setBillingDialogOpen}
        onSuccess={fetchBills}
      />

      {selectedBill && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          billing={selectedBill}
          onSuccess={fetchBills}
        />
      )}
    </div>
  );
}

interface BillingTableProps {
  bills: Billing[];
  isLoading: boolean;
  onPayment: (bill: Billing) => void;
  getStatusBadge: (status: string) => React.JSX.Element;
}

function BillingTable({
  bills,
  isLoading,
  onPayment,
  getStatusBadge,
}: BillingTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill Number</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
              </TableRow>
            ))
          ) : bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No bills found
              </TableCell>
            </TableRow>
          ) : (
            bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-mono font-medium">{bill.billNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {bill.client.firstName} {bill.client.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">{bill.client.mrn}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">${bill.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(bill.status)}</TableCell>
                <TableCell>{bill.paymentMethod || "-"}</TableCell>
                <TableCell>
                  {bill.status !== "PAID" ? (
                    <Button size="sm" onClick={() => onPayment(bill)}>
                      Record Payment
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPayment(bill)}
                    >
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
