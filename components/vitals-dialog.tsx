"use client";

import { useState } from "react";
import { Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type VitalsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onSuccess?: () => void;
};

export function VitalsDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onSuccess,
}: VitalsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vital signs
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          bloodPressure: bloodPressure || undefined,
          heartRate: heartRate ? parseInt(heartRate) : undefined,
          temperature: temperature ? parseFloat(temperature) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
          respiratoryRate: respiratoryRate ? parseInt(respiratoryRate) : undefined,
          oxygenSaturation: oxygenSaturation ? parseFloat(oxygenSaturation) : undefined,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Vitals recorded successfully");
        onOpenChange(false);
        resetForm();
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to record vitals");
      }
    } catch (error) {
      console.error("Error recording vitals:", error);
      toast.error("An error occurred while recording vitals");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBloodPressure("");
    setHeartRate("");
    setTemperature("");
    setWeight("");
    setHeight("");
    setRespiratoryRate("");
    setOxygenSaturation("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Record Vital Signs
          </DialogTitle>
          <DialogDescription>
            Record vital signs for {clientName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
                <Input
                  id="bp"
                  placeholder="120/80"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hr">Heart Rate (bpm)</Label>
                <Input
                  id="hr"
                  type="number"
                  placeholder="72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  placeholder="37.0"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rr">Respiratory Rate (breaths/min)</Label>
                <Input
                  id="rr"
                  type="number"
                  placeholder="16"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="170.0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spo2">Oxygen Saturation (%)</Label>
              <Input
                id="spo2"
                type="number"
                step="0.1"
                placeholder="98.0"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {weight && height && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">BMI (Auto-calculated)</p>
                <p className="text-2xl font-bold">
                  {(parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Vitals"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
