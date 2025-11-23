"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Vital = {
  id: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bmi?: number;
  recordedAt: string;
  recordedBy?: string;
  notes?: string;
};

type VitalsHistoryProps = {
  clientId: string;
};

export function VitalsHistory({ clientId }: VitalsHistoryProps) {
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVitals();
  }, [clientId]);

  const fetchVitals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vitals?clientId=${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setVitals(data);
      }
    } catch (error) {
      console.error("Error fetching vitals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVitalStatus = (value: number, min: number, max: number) => {
    if (value < min) return { status: "low", icon: TrendingDown, color: "text-blue-600" };
    if (value > max) return { status: "high", icon: TrendingUp, color: "text-red-600" };
    return { status: "normal", icon: Activity, color: "text-green-600" };
  };

  const getBMICategory = (bmi?: number) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: "Underweight", color: "bg-blue-100 text-blue-800" };
    if (bmi < 25) return { label: "Normal", color: "bg-green-100 text-green-800" };
    if (bmi < 30) return { label: "Overweight", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Obese", color: "bg-red-100 text-red-800" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vitals History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (vitals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vitals History</CardTitle>
          <CardDescription>No vital signs recorded yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals History</CardTitle>
        <CardDescription>Recent vital sign measurements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vitals.map((vital) => (
          <Card key={vital.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(vital.recordedAt), "PPp")}
                  </p>
                  {vital.recordedBy && (
                    <p className="text-xs text-muted-foreground">
                      Recorded by: {vital.recordedBy}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vital.bloodPressure && (
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="text-lg font-semibold">{vital.bloodPressure}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                )}
                {vital.heartRate && (
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="text-lg font-semibold">{vital.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                )}
                {vital.temperature && (
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="text-lg font-semibold">{vital.temperature}°C</p>
                  </div>
                )}
                {vital.respiratoryRate && (
                  <div>
                    <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                    <p className="text-lg font-semibold">{vital.respiratoryRate}</p>
                    <p className="text-xs text-muted-foreground">breaths/min</p>
                  </div>
                )}
                {vital.weight && (
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-lg font-semibold">{vital.weight} kg</p>
                  </div>
                )}
                {vital.height && (
                  <div>
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="text-lg font-semibold">{vital.height} cm</p>
                  </div>
                )}
                {vital.oxygenSaturation && (
                  <div>
                    <p className="text-xs text-muted-foreground">SpO2</p>
                    <p className="text-lg font-semibold">{vital.oxygenSaturation}%</p>
                  </div>
                )}
                {vital.bmi && (
                  <div>
                    <p className="text-xs text-muted-foreground">BMI</p>
                    <p className="text-lg font-semibold">{vital.bmi.toFixed(1)}</p>
                    {getBMICategory(vital.bmi) && (
                      <Badge className={getBMICategory(vital.bmi)!.color}>
                        {getBMICategory(vital.bmi)!.label}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {vital.notes && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">{vital.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
