"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { HeartPulse, Clock, Check, AlertCircle, Pill, FileText } from "lucide-react";

interface NursingTask {
  id: string;
  bed: string;
  patientName: string;
  uhid: string;
  taskType: "VITALS" | "MEDICATION" | "DOCTOR_ORDER" | "DRESSING";
  description: string;
  dueTime: string;
  status: "PENDING" | "COMPLETED";
}

export default function NursingStationPage() {
  const [selectedWard, setSelectedWard] = useState("Ward A (Medical)");
  const [tasks, setTasks] = useState<NursingTask[]>([
    {
      id: "tsk_1",
      bed: "Bed A-101",
      patientName: "Raj Kumar",
      uhid: "HOS-001284",
      taskType: "MEDICATION",
      description: "Administer Telmisartan 40mg (1 Tab oral) post-lunch",
      dueTime: "01:00 PM",
      status: "PENDING",
    },
    {
      id: "tsk_2",
      bed: "Bed A-101",
      patientName: "Raj Kumar",
      uhid: "HOS-001284",
      taskType: "VITALS",
      description: "Routine 4-hourly Blood Pressure & Pulse measurement",
      dueTime: "02:00 PM",
      status: "PENDING",
    },
    {
      id: "tsk_3",
      bed: "Bed A-105",
      patientName: "Suresh Gupta",
      uhid: "HOS-001270",
      taskType: "DOCTOR_ORDER",
      description: "Collect morning fasting blood sample for Serum Electrolytes",
      dueTime: "08:00 AM",
      status: "COMPLETED",
    },
    {
      id: "tsk_4",
      bed: "Bed A-105",
      patientName: "Suresh Gupta",
      uhid: "HOS-001270",
      taskType: "MEDICATION",
      description: "IV Pantoprazole 40mg infusion",
      dueTime: "06:00 PM",
      status: "PENDING",
    },
  ]);

  const { success } = useToast();

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "PENDING" ? "COMPLETED" : "PENDING" }
          : t
      )
    );
    success("Task Updated", "Nursing task marked as completed.");
  };

  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Nursing Station Workstation
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Shift Nurse: Ananya Iyer · {selectedWard} · Duty: Morning Shift
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="h-8 text-xs w-48"
          >
            <option value="Ward A (Medical)">Ward A (Medical - 2nd Fl)</option>
            <option value="Ward B (Surgical)">Ward B (Surgical - 2nd Fl)</option>
            <option value="Main ICU">Main ICU (3rd Fl)</option>
          </Select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Admitted Patients" value="32" subtitle="Ward A Capacity: 40 Beds" />
        <StatCard
          title="Tasks Due"
          value={pendingCount}
          changeType="positive"
          subtitle="Medications & Vitals"
        />
        <StatCard title="Doctor Orders" value="5" subtitle="3 Pending Review" />
        <StatCard title="Discharges Expected" value="2" subtitle="Post-consult clearance" />
      </div>

      {/* Task-Oriented List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Ward Tasks & Medication Schedule
          </h3>
          <span className="text-xs text-foreground-muted">Sorted by due time</span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";

            return (
              <Card
                key={task.id}
                className={`p-4 transition-all flex items-center justify-between gap-4 ${
                  isCompleted ? "opacity-60 bg-slate-50 dark:bg-slate-900/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors mt-0.5 ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950 text-primary px-2 py-0.5 rounded">
                        {task.bed}
                      </span>
                      <span className="font-bold text-xs text-foreground dark:text-foreground-dark">
                        {task.patientName}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        ({task.uhid})
                      </span>
                      <Badge
                        variant={
                          task.taskType === "MEDICATION"
                            ? "primary"
                            : task.taskType === "VITALS"
                            ? "warning"
                            : "default"
                        }
                      >
                        {task.taskType}
                      </Badge>
                    </div>

                    <p
                      className={`text-xs ${
                        isCompleted
                          ? "line-through text-foreground-muted"
                          : "text-foreground dark:text-foreground-dark font-medium"
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-bold text-foreground-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {task.dueTime}
                  </span>
                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "soft"}
                    onClick={() => toggleTask(task.id)}
                  >
                    {isCompleted ? "Reopen" : "Mark Done"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
