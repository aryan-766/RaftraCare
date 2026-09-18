"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { Logo } from "@/components/ui/Logo";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { patientsApi } from "@/lib/api/patients";
import { appointmentsApi } from "@/lib/api/appointments";
import { Menu } from "lucide-react";
import { DesktopLock } from "@/components/layout/DesktopLock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hospital, isLoading } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { success, error } = useToast();

  // Quick Action Form States (Must be declared before any conditional returns)
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
    patient_id: "",
    patient_name: "",
    patient_uhid: "",
    doctor_name: "",
    doctor_id: "",
    department_name: "General Medicine",
    department_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    appointment_time: "10:30",
    reason: "",
    priority: "NORMAL",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      const stored =
        typeof window !== "undefined" &&
        (localStorage.getItem("raftracare_access_token") ||
          localStorage.getItem("raftracare-user"));
      if (!stored) {
        window.location.href = "/login";
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background dark:bg-background-dark text-xs space-y-3">
        <Logo size="lg" subtitle="Loading Operations..." />
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mt-2" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.first_name || !patientForm.phone) {
      error("Missing fields", "Please enter patient name and contact phone.");
      return;
    }
    try {
      const created = await patientsApi.register({
        first_name: patientForm.first_name,
        last_name: patientForm.last_name || "Patient",
        gender: patientForm.gender as any,
        date_of_birth: "1990-01-01",
        phone: patientForm.phone,
        blood_group: patientForm.blood_group,
        address_line1: patientForm.address,
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
    } catch (err: any) {
      error("Registration Failed", err.message || "Could not register patient.");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.patient_id) {
      error("Missing fields", "Please select or provide patient ID.");
      return;
    }
    try {
      const apt = await appointmentsApi.book({
        patient_id: appointmentForm.patient_id,
        doctor_id: appointmentForm.doctor_id || user.id,
        department_id: appointmentForm.department_id || undefined,
        appointment_date: appointmentForm.appointment_date,
        slot_start_time: appointmentForm.appointment_time || "10:30",
        slot_end_time: "11:00",
        reason: appointmentForm.reason,
        priority: appointmentForm.priority as any,
      });
      success("Appointment Booked", `Token #${apt.token_number} confirmed.`);
      setActiveDrawer(null);
    } catch (err: any) {
      error("Booking Failed", err.message || "Could not book appointment.");
    }
  };

  return (
    <>
      {/* Mobile Lock: Enforces Desktop / Tablet landscape for clinical safety */}
      <DesktopLock />

      {/* Clinical Workstation Layout (Only visible on screens >= 1024px) */}
      <div className="hidden lg:flex h-screen overflow-hidden bg-background dark:bg-background-dark">
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
          <Logo size="xs" />
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
        subtitle="UHID will be automatically generated by RaftraCare"
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
            label="Patient ID / UUID *"
            required
            value={appointmentForm.patient_id}
            onChange={(e) => setAppointmentForm({ ...appointmentForm, patient_id: e.target.value })}
            placeholder="e.g. pat_9482 or UUID"
          />
          <Input
            label="Patient Full Name"
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
    </>
  );
}
