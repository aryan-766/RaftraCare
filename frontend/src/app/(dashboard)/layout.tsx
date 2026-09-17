"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/client";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { success, error } = useToast();

  // Quick Action Form States
  const [patientForm, setPatientForm] = useState({
    first_name: "",
    last_name: "",
    gender: "MALE",
    age: "35",
    phone: "",
    blood_group: "B+",
    address: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient_name: "",
    patient_uhid: "HOS-001284",
    doctor_name: "Dr. Rajesh Sharma",
    doctor_id: "doc_01",
    department_name: "Cardiology",
    department_id: "dept_cardio",
    appointment_date: "2026-09-17",
    appointment_time: "10:30 AM",
    reason: "",
    priority: "NORMAL",
  });

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.first_name || !patientForm.phone) {
      error("Missing fields", "Please enter patient name and contact phone.");
      return;
    }
    const created = await api.createPatient({
      hospital_id: "hosp_metro_01",
      first_name: patientForm.first_name,
      last_name: patientForm.last_name,
      gender: patientForm.gender as "MALE" | "FEMALE",
      dob: "1990-01-01",
      age: parseInt(patientForm.age) || 30,
      phone: patientForm.phone,
      blood_group: patientForm.blood_group,
      address: patientForm.address,
    });
    success("Patient Registered", `UHID ${created.uhid} generated successfully.`);
    setActiveDrawer(null);
    setPatientForm({
      first_name: "",
      last_name: "",
      gender: "MALE",
      age: "35",
      phone: "",
      blood_group: "B+",
      address: "",
    });
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.patient_name) {
      error("Missing fields", "Please enter patient name.");
      return;
    }
    const apt = await api.createAppointment({
      hospital_id: "hosp_metro_01",
      patient_id: "pat_001",
      patient_name: appointmentForm.patient_name,
      patient_uhid: appointmentForm.patient_uhid,
      doctor_id: appointmentForm.doctor_id,
      doctor_name: appointmentForm.doctor_name,
      department_id: appointmentForm.department_id,
      department_name: appointmentForm.department_name,
      appointment_date: appointmentForm.appointment_date,
      appointment_time: appointmentForm.appointment_time,
      status: "CONFIRMED",
      priority: appointmentForm.priority as "NORMAL" | "URGENT",
      is_teleconsult: false,
      reason_for_visit: appointmentForm.reason,
    });
    success("Appointment Booked", `Token ${apt.token_number} generated for ${apt.patient_name}.`);
    setActiveDrawer(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">HospitalOS</span>
          <div className="w-6" />
        </div>

        {/* Global Desktop TopBar */}
        <TopBar
          onOpenCommand={() => setCommandMenuOpen(true)}
          onOpenQuickAction={(action) => setActiveDrawer(action)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Global Command Palette */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
      />

      {/* Drawer: New Patient */}
      <Drawer
        isOpen={activeDrawer === "new-patient"}
        onClose={() => setActiveDrawer(null)}
        title="Register New Patient"
        subtitle="UHID will be automatically generated by HospitalOS"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              required
              value={patientForm.first_name}
              onChange={(e) => setPatientForm({ ...patientForm, first_name: e.target.value })}
              placeholder="e.g. Suresh"
            />
            <Input
              label="Last Name"
              value={patientForm.last_name}
              onChange={(e) => setPatientForm({ ...patientForm, last_name: e.target.value })}
              placeholder="e.g. Sharma"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Gender"
              value={patientForm.gender}
              onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
            <Input
              label="Age"
              type="number"
              value={patientForm.age}
              onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
            />
            <Select
              label="Blood Group"
              value={patientForm.blood_group}
              onChange={(e) => setPatientForm({ ...patientForm, blood_group: e.target.value })}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Select>
          </div>

          <Input
            label="Mobile Number *"
            type="tel"
            required
            value={patientForm.phone}
            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />

          <Input
            label="Residential Address"
            value={patientForm.address}
            onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
            placeholder="Flat / Street, City"
          />

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" type="button" onClick={() => setActiveDrawer(null)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Register & Generate UHID
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Drawer: Book Appointment */}
      <Drawer
        isOpen={activeDrawer === "appointment" || activeDrawer === "walk-in"}
        onClose={() => setActiveDrawer(null)}
        title={activeDrawer === "walk-in" ? "Register Walk-in Patient" : "Book New Appointment"}
        subtitle="Generates real-time token queue assignment"
      >
        <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
          <Input
            label="Patient Name *"
            required
            value={appointmentForm.patient_name}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, patient_name: e.target.value })}
            placeholder="e.g. Raj Kumar"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={appointmentForm.department_name}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, department_name: e.target.value })}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
            </Select>

            <Select
              label="Doctor"
              value={appointmentForm.doctor_name}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor_name: e.target.value })}
            >
              <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma</option>
              <option value="Dr. Arvind Rao">Dr. Arvind Rao</option>
              <option value="Dr. Meenakshi Sundaram">Dr. Meenakshi Sundaram</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={appointmentForm.appointment_date}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })}
            />
            <Input
              label="Slot Time"
              value={appointmentForm.appointment_time}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_time: e.target.value })}
            />
          </div>

          <Select
            label="Priority"
            value={appointmentForm.priority}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, priority: e.target.value })}
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent (Priority Token)</option>
            <option value="VIP">VIP</option>
          </Select>

          <Input
            label="Chief Complaint / Reason"
            value={appointmentForm.reason}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
            placeholder="e.g. Chest pain, followup review"
          />

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" type="button" onClick={() => setActiveDrawer(null)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Confirm & Issue Token
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Drawer: Create Invoice */}
      <Drawer
        isOpen={activeDrawer === "invoice"}
        onClose={() => setActiveDrawer(null)}
        title="Create New Invoice"
        subtitle="Record OPD/IPD billable items"
      >
        <div className="space-y-4 text-xs">
          <Input label="Patient UHID / Name" defaultValue="HOS-001284 — Raj Kumar" />
          <Select label="Billing Category">
            <option>OPD Consultation + Investigations</option>
            <option>IPD Room Charges + Nursing</option>
            <option>Pharmacy Counter Sale</option>
            <option>Emergency Care Package</option>
          </Select>
          <Input label="Total Amount (₹)" type="number" defaultValue="2500" />
          <Select label="Payment Mode">
            <option>Cash</option>
            <option>UPI / QR</option>
            <option>Credit / Debit Card</option>
            <option>TPA / Corporate Insurance</option>
          </Select>
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" onClick={() => setActiveDrawer(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                success("Invoice Created", "INV-2026-0899 created and marked as PAID.");
                setActiveDrawer(null);
              }}
            >
              Generate Receipt
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Drawer: IPD Admission */}
      <Drawer
        isOpen={activeDrawer === "admission"}
        onClose={() => setActiveDrawer(null)}
        title="IPD Patient Admission"
        subtitle="Assign ward bed and initialize inpatient encounter"
      >
        <div className="space-y-4 text-xs">
          <Input label="Patient UHID / Name" defaultValue="HOS-001286 — Amit Jain" />
          <Select label="Admitting Department">
            <option>Cardiology (Dr. Rajesh Sharma)</option>
            <option>Orthopedics (Dr. Arvind Rao)</option>
            <option>Intensive Care Unit (ICU)</option>
          </Select>
          <Select label="Select Available Bed">
            <option>Bed A-102 — Ward A (Medical, 2nd Floor)</option>
            <option>Bed ICU-02 — Main ICU (3rd Floor)</option>
            <option>Bed P-404 — Deluxe Private (4th Floor)</option>
          </Select>
          <Input label="Initial Deposit Amount (₹)" type="number" defaultValue="20000" />
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-border dark:border-border-dark">
            <Button variant="outline" size="sm" onClick={() => setActiveDrawer(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                success("Admission Complete", "Patient Amit Jain admitted to Bed A-102.");
                setActiveDrawer(null);
              }}
            >
              Confirm Admission
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
