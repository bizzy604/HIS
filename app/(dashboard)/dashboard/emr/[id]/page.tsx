"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Save, User, Calendar, FileText, Pill, FlaskConical, ClipboardList, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrescriptionDialog } from "@/components/prescription-dialog";
import { LabOrderDialog } from "@/components/lab-order-dialog";
import { toast } from "sonner";

type Appointment = {
  id: string;
  appointmentType: string;
  scheduledAt: string;
  client: {
    id: string;
    name: string;
    mrn: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    allergies?: string[];
    phone?: string;
  };
  medicalVisit?: {
    id: string;
    chiefComplaint?: string;
    examination?: string;
    diagnosis?: string;
    treatmentPlan?: string;
    notes?: string;
    prescriptions?: any[];
    labOrders?: any[];
  };
};

export default function EMRPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [labOrderDialogOpen, setLabOrderDialogOpen] = useState(false);
  
  // SOAP Notes
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [examination, setExamination] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointments/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAppointment(data);
        
        // If medical visit exists, populate form
        if (data.medicalVisit) {
          setChiefComplaint(data.medicalVisit.chiefComplaint || "");
          setExamination(data.medicalVisit.examination || "");
          setDiagnosis(data.medicalVisit.diagnosis || "");
          setTreatmentPlan(data.medicalVisit.treatmentPlan || "");
          setNotes(data.medicalVisit.notes || "");
        }
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appointment) return;

    setIsSaving(true);
    try {
      const visitData = {
        appointmentId: appointment.id,
        clientId: appointment.client.id,
        chiefComplaint,
        examination,
        diagnosis,
        treatmentPlan,
        notes,
      };

      const response = await fetch(
        appointment.medicalVisit
          ? `/api/medical-visits/${appointment.medicalVisit.id}`
          : "/api/medical-visits",
        {
          method: appointment.medicalVisit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitData),
        }
      );

      if (response.ok) {
        await fetchAppointment();
        toast.success("Medical record saved successfully");
      } else {
        toast.error("Failed to save medical record");
      }
    } catch (error) {
      console.error("Error saving medical visit:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!appointment || !appointment.medicalVisit) {
      toast.error("Please save the consultation first");
      return;
    }

    setIsSaving(true);
    try {
      // Mark appointment as completed
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (response.ok) {
        // Refresh to get latest data
        await fetchAppointment();
        
        // Build routing message
        let routingMessage = "Consultation completed.";
        const prescriptions = appointment.medicalVisit.prescriptions || [];
        const labOrders = appointment.medicalVisit.labOrders || [];
        
        if (prescriptions.length > 0 || labOrders.length > 0) {
          const destinations = [];
          if (prescriptions.length > 0) {
            destinations.push(`Pharmacy (${prescriptions.length} prescription${prescriptions.length > 1 ? 's' : ''})`);
          }
          if (labOrders.length > 0) {
            destinations.push(`Laboratory (${labOrders.length} test${labOrders.length > 1 ? 's' : ''})`);
          }
          routingMessage += ` Patient should proceed to: ${destinations.join(', ')}, then Billing.`;
        } else {
          routingMessage += " Patient should proceed to Billing.";
        }
        
        toast.success(routingMessage, { duration: 5000 });
        
        setTimeout(() => {
          router.push("/dashboard/queue");
        }, 2000);
      } else {
        toast.error("Failed to complete appointment");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">Appointment not found</p>
        <Button onClick={() => router.push("/dashboard/queue")}>
          Back to Queue
        </Button>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/queue")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Electronic Medical Record</h1>
            <p className="text-muted-foreground">
              Document patient consultation using SOAP notes
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!appointment.medicalVisit && (
            <p className="text-sm text-muted-foreground self-center mr-2">
              Save consultation first to add prescriptions/lab orders
            </p>
          )}
          <Button
            variant="outline"
            onClick={() => setLabOrderDialogOpen(true)}
            disabled={!appointment.medicalVisit}
          >
            <FlaskConical className="mr-2 h-4 w-4" />
            Order Lab Test
          </Button>
          <Button
            variant="outline"
            onClick={() => setPrescriptionDialogOpen(true)}
            disabled={!appointment.medicalVisit}
          >
            <Pill className="mr-2 h-4 w-4" />
            Prescription
          </Button>
          <Button 
            variant="outline"
            onClick={handleSave} 
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={isSaving || !appointment.medicalVisit} 
            size="lg"
          >
            <Save className="mr-2 h-4 w-4" />
            Complete Consultation
          </Button>
        </div>
      </div>

      {/* Patient Routing Information */}
      {appointment.medicalVisit && (appointment.medicalVisit.prescriptions?.length > 0 || appointment.medicalVisit.labOrders?.length > 0) && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Patient Next Steps</h3>
                <div className="space-y-2 text-sm">
                  {appointment.medicalVisit.prescriptions && appointment.medicalVisit.prescriptions.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Pill className="h-4 w-4" />
                      <span>Patient should go to <strong>Pharmacy</strong> to collect {appointment.medicalVisit.prescriptions.length} prescription(s)</span>
                    </div>
                  )}
                  {appointment.medicalVisit.labOrders && appointment.medicalVisit.labOrders.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <FlaskConical className="h-4 w-4" />
                      <span>Patient should go to <strong>Laboratory</strong> for {appointment.medicalVisit.labOrders.length} lab test(s)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Receipt className="h-4 w-4" />
                    <span>Patient should proceed to <strong>Billing</strong> for payment</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-lg">{appointment.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MRN</p>
              <p className="font-mono">{appointment.client.mrn}</p>
            </div>
            {appointment.client.dateOfBirth && (
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p>{calculateAge(appointment.client.dateOfBirth)} years</p>
              </div>
            )}
            {appointment.client.gender && (
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="capitalize">{appointment.client.gender}</p>
              </div>
            )}
            {appointment.client.bloodGroup && (
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <Badge variant="outline">{appointment.client.bloodGroup}</Badge>
              </div>
            )}
            {appointment.client.allergies && appointment.client.allergies.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {appointment.client.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {appointment.client.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{appointment.client.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Appointment Time</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <p>{format(new Date(appointment.scheduledAt), "PPp")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SOAP Notes</CardTitle>
            <CardDescription>
              Subjective, Objective, Assessment, and Plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="subjective" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="subjective">Subjective</TabsTrigger>
                <TabsTrigger value="objective">Objective</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="subjective" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chief-complaint">Chief Complaint</Label>
                  <Textarea
                    id="chief-complaint"
                    placeholder="Patient's main reason for visit in their own words..."
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    What the patient tells you about their symptoms, history, and concerns
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="objective" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examination">Physical Examination</Label>
                  <Textarea
                    id="examination"
                    placeholder="Findings from physical examination, vital signs, test results..."
                    value={examination}
                    onChange={(e) => setExamination(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Observable and measurable data from examination and tests
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis & Assessment</Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Diagnosis based on subjective and objective findings (ICD-10 codes)..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your clinical impression and differential diagnosis
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment-plan">Treatment Plan</Label>
                  <Textarea
                    id="treatment-plan"
                    placeholder="Treatment plan, medications, follow-up instructions..."
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Recommended treatment, prescriptions, and next steps
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-2">
              <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional observations, patient education provided, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription Dialog */}
      {appointment.medicalVisit && (
        <>
          <PrescriptionDialog
            open={prescriptionDialogOpen}
            onOpenChange={setPrescriptionDialogOpen}
            medicalVisitId={appointment.medicalVisit.id}
            onSuccess={fetchAppointment}
          />
          <LabOrderDialog
            open={labOrderDialogOpen}
            onOpenChange={setLabOrderDialogOpen}
            medicalVisitId={appointment.medicalVisit.id}
            onSuccess={fetchAppointment}
          />
        </>
      )}
    </div>
  );
}
