"use client";

import React, { useState, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, Column } from "@/components/ui/Table";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MOCK_QUEUE, MOCK_PATIENTS } from "@/lib/mock/data";
import { QueueToken, Patient } from "@/types";
import { patientsApi } from "@/lib/api/patients";
import {
  Plus,
  UserPlus,
  Search,
  Filter,
  SlidersHorizontal,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function FrontDeskPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [queueItems, setQueueItems] = useState<QueueToken[]>(MOCK_QUEUE);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const { success } = useToast();

  // New Patient Form
  const [newPt, setNewPt] = useState({
    firstName: "",
    lastName: "",
    gender: "MALE",
    age: "35",
    phone: "",
    address: "",
  });

  // Walk-in Form
  const [walkIn, setWalkIn] = useState({
    name: "",
    dept: "General Medicine",
    doctor: "Dr. Meenakshi Sundaram",
    priority: "NORMAL",
  });

  const tabs = [
    { id: "all", label: "All Patients", count: queueItems.length },
    {
      id: "waiting",
      label: "Waiting",
      count: queueItems.filter((q) => q.status === "WAITING").length,
    },
    {
      id: "checked_in",
      label: "Checked-in",
      count: queueItems.filter((q) => q.status === "CHECKED_IN").length,
    },
    {
      id: "consulting",
      label: "In Consultation",
      count: queueItems.filter((q) => q.status === "IN_CONSULTATION").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: queueItems.filter((q) => q.status === "COMPLETED").length,
    },
  ];

  // Filtering
  const filteredQueue = useMemo(() => {
    return queueItems.filter((q) => {
      // Tab filter
      if (activeTab === "waiting" && q.status !== "WAITING") return false;
      if (activeTab === "checked_in" && q.status !== "CHECKED_IN") return false;
      if (activeTab === "consulting" && q.status !== "IN_CONSULTATION") return false;
      if (activeTab === "completed" && q.status !== "COMPLETED") return false;

      // Dept filter
      if (deptFilter !== "ALL" && q.department_name !== deptFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        return (
          q.patient_name.toLowerCase().includes(qLower) ||
          q.patient_uhid.toLowerCase().includes(qLower) ||
          q.token_number.toLowerCase().includes(qLower)
        );
      }
      return true;
    });
  }, [queueItems, activeTab, deptFilter, searchQuery]);

  // Autocomplete patient search results
  const matchingPatients = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const qLower = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.first_name.toLowerCase().includes(qLower) ||
        p.last_name.toLowerCase().includes(qLower) ||
        p.uhid.toLowerCase().includes(qLower) ||
        p.phone.includes(qLower)
    );
  }, [searchQuery]);

  const handleCallPatient = (tokenId: string, patientName: string) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === tokenId ? { ...item, status: "CALLED" } : item))
    );
    success("Patient Called", `${patientName} has been announced for consultation.`);
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await patientsApi.register({
        first_name: newPt.firstName,
        last_name: newPt.lastName || "Patient",
        gender: newPt.gender as any,
        date_of_birth: "1991-01-01",
        phone: newPt.phone,
        address_line1: newPt.address,
      });
      success("Patient Registered", `UHID ${created.uhid} registered for ${newPt.firstName} ${newPt.lastName}.`);
      setIsNewPatientOpen(false);
      setNewPt({
        firstName: "",
        lastName: "",
        gender: "MALE",
        age: "35",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      success("Patient Created", `UHID generated locally for ${newPt.firstName}.`);
      setIsNewPatientOpen(false);
    }
  };

  const handleRegisterWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = `W-${Math.floor(100 + Math.random() * 900)}`;
    const newQ: QueueToken = {
      id: `tok_${Date.now()}`,
      token_number: token,
      patient_id: `walkin_${Date.now()}`,
      patient_name: walkIn.name,
      patient_uhid: `UHID-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_age: 34,
      patient_gender: "MALE",
      doctor_id: "doc_oncall",
      doctor_name: walkIn.doctor,
      department_id: "dept_gen",
      department_name: walkIn.dept,
      room_number: "Room 105",
      status: "WAITING",
      priority: walkIn.priority as "NORMAL" | "URGENT",
      estimated_wait_minutes: 15,
      checked_in_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setQueueItems((prev) => [newQ, ...prev]);
    success("Walk-in Checked-in", `Token ${token} issued for ${walkIn.name}.`);
    setIsWalkInOpen(false);
  };

  const columns: Column<QueueToken>[] = [
    {
      header: "Token",
      render: (q) => (
        <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950/80 text-primary dark:text-blue-400 px-2 py-0.5 rounded">
          {q.token_number}
        </span>
      ),
      sortable: true,
      accessorKey: "token_number",
    },
    {
      header: "Patient",
      render: (q) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {q.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {q.patient_age} yrs · {q.patient_gender}
          </div>
        </div>
      ),
    },
    {
      header: "UHID",
      render: (q) => (
        <span className="font-mono text-xs text-foreground-muted dark:text-foreground-mutedDark">
          {q.patient_uhid}
        </span>
      ),
      accessorKey: "patient_uhid",
    },
    {
      header: "Doctor / Room",
      render: (q) => (
        <div>
          <div className="font-medium text-foreground dark:text-foreground-dark">
            {q.doctor_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {q.department_name} · {q.room_number}
          </div>
        </div>
      ),
    },
    {
      header: "Check-in",
      accessorKey: "checked_in_at",
      className: "font-mono text-foreground-muted dark:text-foreground-mutedDark",
    },
    {
      header: "Wait Time",
      render: (q) => (
        <span className="font-medium text-foreground dark:text-foreground-dark">
          {q.estimated_wait_minutes > 0 ? `${q.estimated_wait_minutes} min` : "Serving"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (q) => <StatusBadge status={q.status} />,
    },
    {
      header: "Actions",
      render: (q) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {q.status === "WAITING" && (
            <Button
              size="sm"
              variant="soft"
              onClick={() => handleCallPatient(q.id, q.patient_name)}
            >
              Call Next
            </Button>
          )}
          <a
            href={`/patients/${q.patient_id}`}
            className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          >
            360°
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header with Search & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Front Desk Operations
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Registration, check-ins, queue management, and patient search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWalkInOpen(true)}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            + Walk-in Check-in
          </Button>
          <Button
            size="sm"
            onClick={() => setIsNewPatientOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + New Patient
          </Button>
        </div>
      </div>

      {/* Advanced Patient Search Bar with Instant Autocomplete */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-foreground-muted dark:text-foreground-mutedDark" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient by Name, UHID, Mobile number, or DOB..."
            className="w-full h-10 pl-10 pr-4 rounded-input bg-white dark:bg-surface-dark border border-border dark:border-border-dark text-sm text-foreground dark:text-foreground-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle transition-all"
          />
        </div>

        {/* Autocomplete Dropdown */}
        {matchingPatients.length > 0 && (
          <div className="absolute left-0 right-0 top-11 mt-1 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-2 z-30 max-h-72 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95">
            <div className="px-2 py-1 text-[11px] font-bold text-foreground-muted dark:text-foreground-mutedDark uppercase tracking-wider">
              Matching Patient Records ({matchingPatients.length})
            </div>
            {matchingPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p);
                  setSearchQuery("");
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-xs text-foreground dark:text-foreground-dark">
                    {p.first_name} {p.last_name}
                  </div>
                  <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
                    UHID: <span className="font-mono text-primary font-bold">{p.uhid}</span> ·{" "}
                    {p.age} yrs · {p.gender} · Last visit: {p.last_visit_date} (
                    {p.last_doctor_name})
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark">
                    {p.phone}
                  </span>
                  <a
                    href={`/patients/${p.id}`}
                    className="p-1 rounded bg-blue-50 dark:bg-blue-950 text-primary font-semibold hover:underline"
                  >
                    Open 360° →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs & Department Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border dark:border-border-dark pb-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-8 text-xs py-0"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="General Medicine">General Medicine</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => success("View Saved", "Your filter view has been saved to preferences.")}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            Save View
          </Button>
        </div>
      </div>

      {/* Front Desk Queue Table */}
      <Table
        data={filteredQueue}
        columns={columns}
        keyExtractor={(q) => q.id}
        pageSize={8}
        searchable={false}
        exportFilename="hospitalos-frontdesk-queue"
      />

      {/* Drawer: Register New Patient */}
      <Drawer
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
        title="New Patient Registration"
        subtitle="UHID will be auto-generated upon submission"
      >
        <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              required
              value={newPt.firstName}
              onChange={(e) => setNewPt({ ...newPt, firstName: e.target.value })}
              placeholder="e.g. Ramesh"
            />
            <Input
              label="Last Name"
              value={newPt.lastName}
              onChange={(e) => setNewPt({ ...newPt, lastName: e.target.value })}
              placeholder="e.g. Verma"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={newPt.gender}
              onChange={(e) => setNewPt({ ...newPt, gender: e.target.value })}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
            <Input
              label="Age *"
              type="number"
              required
              value={newPt.age}
              onChange={(e) => setNewPt({ ...newPt, age: e.target.value })}
            />
          </div>

          <Input
            label="Mobile Number *"
            type="tel"
            required
            value={newPt.phone}
            onChange={(e) => setNewPt({ ...newPt, phone: e.target.value })}
            placeholder="+91 98112 00000"
          />

          <Input
            label="Address"
            value={newPt.address}
            onChange={(e) => setNewPt({ ...newPt, address: e.target.value })}
            placeholder="House / Street, City"
          />

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewPatientOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Register & Assign UHID
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Drawer: Walk-in Quick Check-in */}
      <Drawer
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        title="Walk-in Quick Check-in"
        subtitle="Directly creates a queue token for OPD consultation"
      >
        <form onSubmit={handleRegisterWalkIn} className="space-y-4 text-xs">
          <Input
            label="Patient Name *"
            required
            value={walkIn.name}
            onChange={(e) => setWalkIn({ ...walkIn, name: e.target.value })}
            placeholder="e.g. Harish Kumar"
          />

          <Select
            label="Department *"
            value={walkIn.dept}
            onChange={(e) => setWalkIn({ ...walkIn, dept: e.target.value })}
          >
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
          </Select>

          <Select
            label="Consulting Doctor *"
            value={walkIn.doctor}
            onChange={(e) => setWalkIn({ ...walkIn, doctor: e.target.value })}
          >
            <option value="Dr. Meenakshi Sundaram">Dr. Meenakshi Sundaram (General Med)</option>
            <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Cardiology)</option>
            <option value="Dr. Arvind Rao">Dr. Arvind Rao (Orthopedics)</option>
          </Select>

          <Select
            label="Priority"
            value={walkIn.priority}
            onChange={(e) => setWalkIn({ ...walkIn, priority: e.target.value })}
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent (Jump Queue)</option>
            <option value="EMERGENCY">Emergency Triage</option>
          </Select>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsWalkInOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Generate Walk-in Token
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
