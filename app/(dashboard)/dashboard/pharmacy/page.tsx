"use client";

import { useEffect, useState } from "react";
import { Plus, Search, AlertTriangle, Package, TrendingDown, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";

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
import { MedicineDialog } from "@/components/medicine-dialog";
import { BatchDialog } from "@/components/batch-dialog";

type Medicine = {
  id: string;
  name: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  unit: string;
  batches: {
    id: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
  }[];
};

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicineDialogOpen, setMedicineDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/medicines");
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockMedicines = medicines.filter(
    (med) => med.stockQuantity <= med.reorderLevel
  );

  const expiringBatches = medicines.flatMap((med) =>
    med.batches
      .filter((batch) => {
        const expiryDate = new Date(batch.expiryDate);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiryDate <= threeMonthsFromNow && expiryDate >= new Date();
      })
      .map((batch) => ({ ...batch, medicine: med }))
  );

  const getStockStatus = (med: Medicine) => {
    if (med.stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (med.stockQuantity <= med.reorderLevel) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Low Stock</Badge>;
    }
    return <Badge variant="outline">In Stock</Badge>;
  };

  const handleExport = () => {
    const exportData = filteredMedicines.map(med => ({
      'Name': med.name,
      'Generic Name': med.genericName || '',
      'Category': med.category || '',
      'Manufacturer': med.manufacturer || '',
      'Stock Quantity': med.stockQuantity,
      'Unit': med.unit,
      'Reorder Level': med.reorderLevel,
      'Unit Price': med.unitPrice.toFixed(2),
      'Total Batches': med.batches.length,
      'Stock Status': med.stockQuantity === 0 ? 'Out of Stock' : med.stockQuantity <= med.reorderLevel ? 'Low Stock' : 'In Stock',
    }));
    exportToCSV(exportData, 'pharmacy_inventory');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy & Inventory</h1>
        <p className="text-muted-foreground">
          Manage medicines, batches, and inventory levels
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicines.length}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
              <TrendingDown className="h-4 w-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockMedicines.length}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringBatches.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock ({lowStockMedicines.length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring ({expiringBatches.length})</TabsTrigger>
          </TabsList>
          <Button onClick={() => setMedicineDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </div>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medicine Inventory</CardTitle>
                  <CardDescription>Complete list of all medicines</CardDescription>
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
                        placeholder="Search medicines..."
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Generic Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Status</TableHead>
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
                          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredMedicines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No medicines found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMedicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.genericName || "-"}</TableCell>
                          <TableCell>{medicine.category || "-"}</TableCell>
                          <TableCell>
                            {medicine.stockQuantity} {medicine.unit}
                          </TableCell>
                          <TableCell>${medicine.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>{getStockStatus(medicine)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMedicine(medicine);
                                setBatchDialogOpen(true);
                              }}
                            >
                              Add Batch
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Low Stock Medicines</CardTitle>
              <CardDescription>Medicines that need to be reordered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockMedicines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          All medicines are adequately stocked
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStockMedicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>
                            <span className="text-orange-600 font-semibold">
                              {medicine.stockQuantity} {medicine.unit}
                            </span>
                          </TableCell>
                          <TableCell>{medicine.reorderLevel} {medicine.unit}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedMedicine(medicine);
                                setBatchDialogOpen(true);
                              }}
                            >
                              Add Stock
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Expiring Batches</CardTitle>
              <CardDescription>Batches expiring within 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringBatches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No batches expiring soon
                        </TableCell>
                      </TableRow>
                    ) : (
                      expiringBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.medicine.name}</TableCell>
                          <TableCell className="font-mono">{batch.batchNumber}</TableCell>
                          <TableCell className="text-red-600">
                            {new Date(batch.expiryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {batch.quantity} {batch.medicine.unit}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MedicineDialog
        open={medicineDialogOpen}
        onOpenChange={setMedicineDialogOpen}
        onSuccess={fetchMedicines}
      />

      {selectedMedicine && (
        <BatchDialog
          open={batchDialogOpen}
          onOpenChange={setBatchDialogOpen}
          medicine={selectedMedicine}
          onSuccess={fetchMedicines}
        />
      )}
    </div>
  );
}
