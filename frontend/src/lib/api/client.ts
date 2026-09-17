import {
  Patient,
  Appointment,
  QueueToken,
  Bed,
  Invoice,
  LabOrder,
  Medicine,
  InsuranceClaim,
} from "@/types";
import {
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_QUEUE,
  MOCK_BEDS,
  MOCK_INVOICES,
  MOCK_LAB_ORDERS,
  MOCK_MEDICINES,
  MOCK_INSURANCE_CLAIMS,
} from "../mock/data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Local in-memory store initialized from mock data to allow real CRUD (e.g. adding patients, booking appointments, bed updates)
class MockStore {
  patients = [...MOCK_PATIENTS];
  appointments = [...MOCK_APPOINTMENTS];
  queue = [...MOCK_QUEUE];
  beds = [...MOCK_BEDS];
  invoices = [...MOCK_INVOICES];
  labOrders = [...MOCK_LAB_ORDERS];
  medicines = [...MOCK_MEDICINES];
  claims = [...MOCK_INSURANCE_CLAIMS];

  addPatient(patient: Omit<Patient, "id" | "uhid" | "created_at">): Patient {
    const count = this.patients.length + 1;
    const uhid = `HOS-${String(1284 + count).padStart(6, "0")}`;
    const newPatient: Patient = {
      ...patient,
      id: `pat_${Date.now()}`,
      uhid,
      created_at: new Date().toISOString(),
      last_visit_date: new Date().toISOString().split("T")[0],
    };
    this.patients.unshift(newPatient);
    return newPatient;
  }

  addAppointment(apt: Omit<Appointment, "id" | "token_number">): Appointment {
    const tokenNumber = `T-${Math.floor(100 + Math.random() * 900)}`;
    const newApt: Appointment = {
      ...apt,
      id: `apt_${Date.now()}`,
      token_number: tokenNumber,
    };
    this.appointments.unshift(newApt);

    // Also add to queue
    const newQueueItem: QueueToken = {
      id: `tok_${Date.now()}`,
      token_number: tokenNumber,
      patient_id: apt.patient_id,
      patient_name: apt.patient_name,
      patient_uhid: apt.patient_uhid,
      patient_age: 40,
      patient_gender: "MALE",
      doctor_id: apt.doctor_id,
      doctor_name: apt.doctor_name,
      department_id: apt.department_id,
      department_name: apt.department_name,
      room_number: "Room 101",
      status: "WAITING",
      priority: apt.priority,
      estimated_wait_minutes: 15,
      checked_in_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    this.queue.push(newQueueItem);
    return newApt;
  }

  updateTokenStatus(tokenId: string, status: QueueToken["status"]): QueueToken | null {
    const item = this.queue.find((q) => q.id === tokenId);
    if (item) {
      item.status = status;
      return { ...item };
    }
    return null;
  }

  updateBedStatus(bedId: string, status: Bed["status"]): Bed | null {
    const bed = this.beds.find((b) => b.id === bedId);
    if (bed) {
      bed.status = status;
      if (status === "AVAILABLE" || status === "CLEANING") {
        bed.current_patient_id = undefined;
        bed.current_patient_name = undefined;
        bed.current_patient_uhid = undefined;
      }
      return { ...bed };
    }
    return null;
  }

  addInvoice(inv: Omit<Invoice, "id" | "invoice_number" | "created_at">): Invoice {
    const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: Invoice = {
      ...inv,
      id: `inv_${Date.now()}`,
      invoice_number: invNum,
      created_at: new Date().toISOString(),
    };
    this.invoices.unshift(newInv);
    return newInv;
  }
}

export const mockStore = new MockStore();

// Universal API Client with automatic graceful fallback
export const api = {
  // Patients
  async getPatients(search?: string): Promise<Patient[]> {
    try {
      const res = await fetch(`${API_BASE}/patients/?search=${encodeURIComponent(search || "")}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("hospitalos-token") || ""}` },
      });
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      let list = mockStore.patients;
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.first_name.toLowerCase().includes(q) ||
            p.last_name.toLowerCase().includes(q) ||
            p.uhid.toLowerCase().includes(q) ||
            p.phone.includes(q)
        );
      }
      return list;
    }
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`);
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.patients.find((p) => p.id === id || p.uhid === id);
    }
  },

  async createPatient(patient: Omit<Patient, "id" | "uhid" | "created_at">): Promise<Patient> {
    try {
      const res = await fetch(`${API_BASE}/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.addPatient(patient);
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await fetch(`${API_BASE}/appointments/`);
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.appointments;
    }
  },

  async createAppointment(apt: Omit<Appointment, "id" | "token_number">): Promise<Appointment> {
    try {
      const res = await fetch(`${API_BASE}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apt),
      });
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.addAppointment(apt);
    }
  },

  // Queue & Token
  async getQueue(): Promise<QueueToken[]> {
    try {
      const res = await fetch(`${API_BASE}/appointments/queue`);
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.queue;
    }
  },

  async updateQueueStatus(tokenId: string, status: QueueToken["status"]): Promise<QueueToken | null> {
    try {
      const res = await fetch(`${API_BASE}/appointments/${tokenId}/queue`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.updateTokenStatus(tokenId, status);
    }
  },

  // Beds & Wards
  async getBeds(): Promise<Bed[]> {
    return mockStore.beds;
  },

  async updateBed(bedId: string, status: Bed["status"]): Promise<Bed | null> {
    return mockStore.updateBedStatus(bedId, status);
  },

  // Invoices & Billing
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE}/billing/invoices`);
      if (!res.ok) throw new Error("Backend response error");
      const json = await res.json();
      return json.data || json;
    } catch {
      return mockStore.invoices;
    }
  },

  async createInvoice(inv: Omit<Invoice, "id" | "invoice_number" | "created_at">): Promise<Invoice> {
    return mockStore.addInvoice(inv);
  },

  // Lab Orders
  async getLabOrders(): Promise<LabOrder[]> {
    return mockStore.labOrders;
  },

  // Pharmacy & Inventory
  async getMedicines(): Promise<Medicine[]> {
    return mockStore.medicines;
  },

  // Insurance
  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    return mockStore.claims;
  },
};
