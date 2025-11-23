"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Clock, CheckCircle, AlertCircle, FlaskConical } from "lucide-react";

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
import { LabResultDialog } from "@/components/lab-result-dialog";

type LabOrder = {
  id: string;
  testName: string;
  testCategory?: string;
  priority: string;
  status: string;
  orderedAt: string;
  completedAt?: string;
  notes?: string;
  medicalVisit: {
    id: string;
    client: {
      id: string;
      mrn: string;
      name: string;
      dateOfBirth: string;
    };
    doctor: {
      id: string;
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

export default function LaboratoryPage() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const fetchLabOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/lab-orders");
      if (response.ok) {
        const data = await response.json();
        setLabOrders(data);
      }
    } catch (error) {
      console.error("Error fetching lab orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = labOrders.filter(
    (order) =>
      order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.medicalVisit.client.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.medicalVisit.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "ORDERED" || order.status === "IN_PROGRESS"
  );

  const completedOrders = filteredOrders.filter(
    (order) => order.status === "COMPLETED"
  );

  const urgentOrders = filteredOrders.filter(
    (order) => order.priority === "URGENT" || order.priority === "STAT"
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      ORDERED: { variant: "secondary", label: "Ordered" },
      IN_PROGRESS: { variant: "default", label: "In Progress" },
      COMPLETED: { variant: "outline", label: "Completed", className: "bg-green-100 text-green-800" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.ORDERED;
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (priority: string) => {
    if (priority === "STAT") {
      return <Badge variant="destructive">STAT</Badge>;
    }
    if (priority === "URGENT") {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Urgent</Badge>;
    }
    return <Badge variant="outline">Routine</Badge>;
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Laboratory</h1>
        <p className="text-muted-foreground">
          Manage lab orders, results, and pathology reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labOrders.length}</div>
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
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="all">All Orders ({labOrders.length})</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lab Orders</CardTitle>
                <CardDescription>View and manage laboratory orders</CardDescription>
              </div>
              <div className="w-72">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by test, MRN, or patient..."
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
              <LabOrdersTable
                orders={pendingOrders}
                isLoading={isLoading}
                onEnterResults={(order) => {
                  setSelectedOrder(order);
                  setResultDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
                getUrgencyBadge={getUrgencyBadge}
                calculateAge={calculateAge}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <LabOrdersTable
                orders={completedOrders}
                isLoading={isLoading}
                onEnterResults={(order) => {
                  setSelectedOrder(order);
                  setResultDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
                getUrgencyBadge={getUrgencyBadge}
                calculateAge={calculateAge}
              />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <LabOrdersTable
                orders={filteredOrders}
                isLoading={isLoading}
                onEnterResults={(order) => {
                  setSelectedOrder(order);
                  setResultDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
                getUrgencyBadge={getUrgencyBadge}
                calculateAge={calculateAge}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {selectedOrder && (
        <LabResultDialog
          open={resultDialogOpen}
          onOpenChange={setResultDialogOpen}
          labOrder={selectedOrder}
          onSuccess={fetchLabOrders}
        />
      )}
    </div>
  );
}

interface LabOrdersTableProps {
  orders: LabOrder[];
  isLoading: boolean;
  onEnterResults: (order: LabOrder) => void;
  getStatusBadge: (status: string) => React.JSX.Element;
  getUrgencyBadge: (urgency: string) => React.JSX.Element;
  calculateAge: (dob: string) => number;
}

function LabOrdersTable({
  orders,
  isLoading,
  onEnterResults,
  getStatusBadge,
  getUrgencyBadge,
  calculateAge,
}: LabOrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Test Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ordered By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No lab orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.medicalVisit.client.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.medicalVisit.client.mrn} • {calculateAge(order.medicalVisit.client.dateOfBirth)}y
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{order.testName}</TableCell>
                <TableCell>{order.testCategory || "-"}</TableCell>
                <TableCell>{getUrgencyBadge(order.priority)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{order.medicalVisit.doctor.name}</span>
                    {order.medicalVisit.doctor.specialization && (
                      <span className="text-xs text-muted-foreground">
                        {order.medicalVisit.doctor.specialization}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(order.orderedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.status !== "COMPLETED" ? (
                    <Button
                      size="sm"
                      onClick={() => onEnterResults(order)}
                    >
                      Enter Results
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEnterResults(order)}
                    >
                      View Results
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
