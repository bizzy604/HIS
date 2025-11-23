"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Activity, Calendar, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalsDialog } from "@/components/vitals-dialog";
import { VitalsHistory } from "@/components/vitals-history";

type Client = {
  id: string;
  mrn: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  address?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  status: string;
  createdAt: string;
};

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">Client not found</p>
        <Button onClick={() => router.push("/dashboard/clients")}>
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/clients")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground font-mono">MRN: {client.mrn}</p>
          </div>
        </div>
        <Badge variant={client.status === "active" ? "default" : "secondary"}>
          {client.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.dateOfBirth && (
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold">{calculateAge(client.dateOfBirth)} years</p>
                <p className="text-xs text-muted-foreground">
                  DOB: {format(new Date(client.dateOfBirth), "PPP")}
                </p>
              </div>
            )}
            {client.gender && (
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="capitalize">{client.gender}</p>
              </div>
            )}
            {client.bloodGroup && (
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <Badge variant="outline">{client.bloodGroup}</Badge>
              </div>
            )}
            {client.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{client.phone}</p>
              </div>
            )}
            {client.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="break-all">{client.email}</p>
              </div>
            )}
            {client.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm">{client.address}</p>
              </div>
            )}
            {client.emergencyContact && (
              <div>
                <p className="text-sm text-muted-foreground">Emergency Contact</p>
                <p>{client.emergencyContact}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {client.allergies && client.allergies.length > 0 && (
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Allergies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {client.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {client.insuranceProvider && (
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-semibold">{client.insuranceProvider}</p>
                </div>
                {client.policyNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Number</p>
                    <p className="font-mono">{client.policyNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="vitals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="vitals">
                <Activity className="h-4 w-4 mr-2" />
                Vital Signs
              </TabsTrigger>
              <TabsTrigger value="visits">
                <FileText className="h-4 w-4 mr-2" />
                Medical Visits
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vitals">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setVitalsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Vitals
                </Button>
              </div>
              <VitalsHistory clientId={client.id} />
            </TabsContent>

            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Visit History</CardTitle>
                  <CardDescription>Previous consultations and medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Medical visit history coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                  <CardDescription>Past and upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Appointment history coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <VitalsDialog
        open={vitalsDialogOpen}
        onOpenChange={setVitalsDialogOpen}
        clientId={client.id}
        clientName={client.name}
      />
    </div>
  );
}
