"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock, User, AlertCircle, ArrowRight } from "lucide-react";

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
import { cn } from "@/lib/utils";

type QueueAppointment = {
  id: string;
  appointmentType: string;
  status: string;
  scheduledAt: string;
  client: {
    id: string;
    name: string;
    mrn: string;
    dateOfBirth?: string;
    phone?: string;
  };
};

export default function QueuePage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<QueueAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const response = await fetch(`/api/appointments?date=${today}&status=SCHEDULED,WAITING,IN_PROGRESS`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartConsultation = async (appointmentId: string) => {
    try {
      // Update status to IN_PROGRESS
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });

      // Navigate to EMR page
      router.push(`/dashboard/emr/${appointmentId}`);
    } catch (error) {
      console.error("Error starting consultation:", error);
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      OPD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      FOLLOW_UP: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      EMERGENCY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return (
      <Badge className={cn("font-medium", colors[type] || "")}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const waitingAppointments = appointments.filter(a => a.status === "WAITING" || a.status === "SCHEDULED");
  const inProgressAppointments = appointments.filter(a => a.status === "IN_PROGRESS");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Patient Queue</h1>
        <p className="text-muted-foreground">
          Manage your patient queue and start consultations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>

      {inProgressAppointments.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              In Progress
            </CardTitle>
            <CardDescription>Currently consulting with patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-lg">{appointment.client.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              MRN: {appointment.client.mrn}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(appointment.scheduledAt), "h:mm a")}
                        </div>
                        <div>{getTypeBadge(appointment.appointmentType)}</div>
                      </div>
                      <Button
                        onClick={() => handleStartConsultation(appointment.id)}
                        variant="default"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Waiting Patients</CardTitle>
          <CardDescription>
            Patients waiting for consultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                      <Skeleton className="h-10 w-[120px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : waitingAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients waiting</p>
            </div>
          ) : (
            <div className="space-y-4">
              {waitingAppointments.map((appointment, index) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{appointment.client.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              MRN: {appointment.client.mrn}
                            </p>
                            {appointment.client.phone && (
                              <p className="text-sm text-muted-foreground">
                                {appointment.client.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(appointment.scheduledAt), "h:mm a")}
                          </div>
                          {getTypeBadge(appointment.appointmentType)}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartConsultation(appointment.id)}
                        size="lg"
                      >
                        Start Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
