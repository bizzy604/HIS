"use client";

import { useEffect, useState } from "react";
import { Search, Clock, CheckCircle, User, Pill, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Prescription = {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
  medicalVisit: {
    id: string;
    client: {
      id: string;
      mrn: string;
      name: string;
    };
    doctor: {
      id: string;
      name: string;
      specialization?: string;
    };
  };
  items: {
    id: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
    medicine: {
      id: string;
      name: string;
      genericName?: string;
      unit: string;
    };
  }[];
};

export default function PrescriptionQueuePage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/prescriptions");
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispense = async (prescriptionId: string) => {
    setIsDispensing(true);
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DISPENSED" }),
      });

      if (response.ok) {
        toast.success("Prescription dispensed successfully");
        fetchPrescriptions();
        setDetailsDialogOpen(false);
      } else {
        toast.error("Failed to dispense prescription");
      }
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      toast.error("An error occurred");
    } finally {
      setIsDispensing(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.medicalVisit.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medicalVisit.client.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.items.some(item => 
        item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const pendingPrescriptions = filteredPrescriptions.filter(rx => rx.status === "PENDING");
  const dispensedPrescriptions = filteredPrescriptions.filter(rx => rx.status === "DISPENSED");

  const getStatusBadge = (status: string) => {
    if (status === "DISPENSED") {
      return <Badge className="bg-green-100 text-green-800">Dispensed</Badge>;
    }
    if (status === "CANCELLED") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const handleExport = () => {
    const exportData = filteredPrescriptions.flatMap(rx =>
      rx.items.map(item => ({
        'Patient': rx.medicalVisit.client.name,
        'MRN': rx.medicalVisit.client.mrn,
        'Doctor': rx.medicalVisit.doctor.name,
        'Medicine': item.medicine.name,
        'Generic Name': item.medicine.genericName || '',
        'Dosage': item.dosage,
        'Frequency': item.frequency,
        'Duration': item.duration,
        'Quantity': item.quantity,
        'Unit': item.medicine.unit,
        'Instructions': item.instructions || '',
        'Status': rx.status,
        'Prescribed Date': new Date(rx.createdAt).toLocaleDateString(),
      }))
    );
    exportToCSV(exportData, 'prescription_queue');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Prescription Queue</h1>
        <p className="text-muted-foreground">
          Dispense medications to patients with prescriptions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Total Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
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
            <div className="text-2xl font-bold">{pendingPrescriptions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Dispensed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dispensedPrescriptions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="dispensed">Dispensed ({dispensedPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="all">All ({prescriptions.length})</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>View and dispense patient prescriptions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="w-72">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient or medicine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="pending" className="mt-0">
              <PrescriptionTable
                prescriptions={pendingPrescriptions}
                isLoading={isLoading}
                onViewDetails={(rx) => {
                  setSelectedPrescription(rx);
                  setDetailsDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="dispensed" className="mt-0">
              <PrescriptionTable
                prescriptions={dispensedPrescriptions}
                isLoading={isLoading}
                onViewDetails={(rx) => {
                  setSelectedPrescription(rx);
                  setDetailsDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <PrescriptionTable
                prescriptions={filteredPrescriptions}
                isLoading={isLoading}
                onViewDetails={(rx) => {
                  setSelectedPrescription(rx);
                  setDetailsDialogOpen(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Prescription Details Dialog */}
      {selectedPrescription && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
              <DialogDescription>
                Review and dispense prescription to patient
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Patient Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedPrescription.medicalVisit.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MRN</p>
                    <p className="font-mono">{selectedPrescription.medicalVisit.client.mrn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{selectedPrescription.medicalVisit.doctor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{new Date(selectedPrescription.createdAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Medicines to Dispense</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPrescription.items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-lg">{index + 1}. {item.medicine.name}</p>
                            {item.medicine.genericName && (
                              <p className="text-sm text-muted-foreground">
                                ({item.medicine.genericName})
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">{item.quantity} {item.medicine.unit}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dosage</p>
                            <p className="font-medium">{item.dosage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Frequency</p>
                            <p className="font-medium">{item.frequency}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{item.duration}</p>
                          </div>
                        </div>
                        {item.instructions && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-sm">
                              <span className="font-medium">Instructions: </span>
                              {item.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedPrescription.notes && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-900">
                      <p className="text-sm font-medium mb-1">Doctor's Notes:</p>
                      <p className="text-sm">{selectedPrescription.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedPrescription.status === "PENDING" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDetailsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDispense(selectedPrescription.id)}
                    disabled={isDispensing}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isDispensing ? "Dispensing..." : "Mark as Dispensed"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface PrescriptionTableProps {
  prescriptions: Prescription[];
  isLoading: boolean;
  onViewDetails: (prescription: Prescription) => void;
  getStatusBadge: (status: string) => React.JSX.Element;
}

function PrescriptionTable({
  prescriptions,
  isLoading,
  onViewDetails,
  getStatusBadge,
}: PrescriptionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Medicines</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
              </TableRow>
            ))
          ) : prescriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No prescriptions found
              </TableCell>
            </TableRow>
          ) : (
            prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{rx.medicalVisit.client.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {rx.medicalVisit.client.mrn}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {rx.items.map((item, idx) => (
                      <div key={item.id} className="text-sm">
                        {idx + 1}. {item.medicine.name} ({item.quantity} {item.medicine.unit})
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{rx.medicalVisit.doctor.name}</TableCell>
                <TableCell>{getStatusBadge(rx.status)}</TableCell>
                <TableCell>{new Date(rx.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant={rx.status === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onViewDetails(rx)}
                  >
                    {rx.status === "PENDING" ? "Dispense" : "View Details"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
