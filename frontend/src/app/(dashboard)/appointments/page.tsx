"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { MOCK_APPOINTMENTS } from "@/lib/mock/data";
import { Appointment } from "@/types";
import { Calendar as CalendarIcon, Clock, User, Plus, Filter, Check, X, RefreshCw } from "lucide-react";

import { appointmentsApi } from "@/lib/api/appointments";

export default function AppointmentsPage() {
  const [view, setView] = useState<"day" | "week" | "month" | "list">("list");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const { success } = useToast();

  const loadAppointments = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await appointmentsApi.list();
      if (list && list.length > 0) {
        const mapped: Appointment[] = list.map((a) => ({
          id: a.id,
          hospital_id: "",
          patient_id: a.patient_id,
          doctor_id: a.doctor_id,
          department_id: "dept_cardio",
          patient_name: `Patient ${a.patient_id.slice(0, 6)}`,
          patient_uhid: `UHID-${a.token_number}`,
          doctor_name: "Attending Physician",
          department_name: "General OPD",
          appointment_date: a.appointment_date,
          appointment_time: a.slot_start_time,
          token_number: String(a.token_number),
          status: a.status,
          priority: a.priority,
          is_teleconsult: false,
        }));
        setAppointments(mapped);
      }
    } catch {
      // Backend offline
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filtered = appointments.filter((a) => {
    if (selectedDept !== "ALL" && a.department_name !== selectedDept) return false;
    return true;
  });

  const handleStatusChange = (status: Appointment["status"]) => {
    if (!selectedApt) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === selectedApt.id ? { ...a, status } : a))
    );
    setSelectedApt({ ...selectedApt, status });
    success("Status Updated", `Appointment marked as ${status.replace(/_/g, " ")}.`);
  };

  const columns: Column<Appointment>[] = [
    {
      header: "Time Slot",
      accessorKey: "appointment_time",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient",
      render: (a) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {a.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-mono">
            {a.patient_uhid}
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "Doctor & Dept",
      render: (a) => (
        <div>
          <div className="font-medium text-foreground dark:text-foreground-dark">
            {a.doctor_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {a.department_name}
          </div>
        </div>
      ),
    },
    {
      header: "Token #",
      accessorKey: "token_number",
      className: "font-mono font-bold text-xs",
    },
    {
      header: "Reason for Visit",
      accessorKey: "reason_for_visit",
      className: "max-w-xs truncate text-foreground-muted dark:text-foreground-mutedDark",
    },
    {
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: "Action",
      render: (a) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedApt(a)}
        >
          Manage Slot
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Appointments & Doctor Schedules
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Manage OPD consultation slots, patient check-ins, and doctor calendars
          </p>
        </div>

        {/* View Switcher & Department Filter */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-border dark:border-border-dark flex items-center gap-1 text-xs font-semibold">
            {(["day", "week", "month", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded capitalize transition-all ${
                  view === v
                    ? "bg-white dark:bg-surface-dark text-primary shadow-xs"
                    : "text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-8 text-xs py-0 w-44"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General Medicine">General Medicine</option>
          </Select>
        </div>
      </div>

      {/* Grid or Table view */}
      {view === "list" ? (
        <Table
          data={filtered}
          columns={columns}
          keyExtractor={(a) => a.id}
          pageSize={10}
          onRowClick={(a) => setSelectedApt(a)}
          exportFilename="hospitalos-appointments"
        />
      ) : (
        /* Calendar Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((a) => (
            <Card
              key={a.id}
              hover
              onClick={() => setSelectedApt(a)}
              className="p-4 cursor-pointer space-y-3 border-l-4 border-l-primary"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {a.appointment_time}
                </span>
                <StatusBadge status={a.status} />
              </div>

              <div>
                <div className="font-bold text-sm text-foreground dark:text-foreground-dark">
                  {a.patient_name}
                </div>
                <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                  UHID: {a.patient_uhid} · Token {a.token_number}
                </div>
              </div>

              <div className="text-xs pt-2 border-t border-border/60 dark:border-border-dark flex items-center justify-between">
                <span className="font-medium">{a.doctor_name}</span>
                <span className="text-foreground-muted">{a.department_name}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Drawer */}
      <Drawer
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        title="Appointment Slot Details"
        subtitle={`Token: ${selectedApt?.token_number} · ${selectedApt?.appointment_time}`}
      >
        {selectedApt && (
          <div className="space-y-5 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">Patient Name:</span>
                <span className="font-bold text-foreground dark:text-foreground-dark">{selectedApt.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">UHID:</span>
                <span className="font-mono font-semibold">{selectedApt.patient_uhid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">Doctor:</span>
                <span className="font-semibold">{selectedApt.doctor_name} ({selectedApt.department_name})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">Current Status:</span>
                <StatusBadge status={selectedApt.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">Reason:</span>
                <span>{selectedApt.reason_for_visit || "General health consultation"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                Update Slot Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatusChange("CHECKED_IN")}
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Mark Checked-in
                </Button>
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => handleStatusChange("IN_CONSULTATION")}
                >
                  Start Consultation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("COMPLETED")}
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleStatusChange("CANCELLED")}
                  leftIcon={<X className="w-3.5 h-3.5" />}
                >
                  Cancel Slot
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
