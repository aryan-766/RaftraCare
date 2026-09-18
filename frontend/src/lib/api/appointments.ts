import { http } from "./client";
import { AppointmentStatus, Priority, QueueStatus } from "@/types";

export interface BookAppointmentPayload {
  patient_id: string;
  doctor_id: string;
  department_id?: string;
  appointment_date: string; // YYYY-MM-DD
  slot_start_time: string; // HH:MM
  slot_end_time: string; // HH:MM
  reason?: string;
  priority?: Priority;
  appointment_type?: string;
}

export interface AppointmentItem {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  slot_start_time: string;
  slot_end_time: string;
  token_number: number;
  status: AppointmentStatus;
  priority: Priority;
  reason?: string;
}

export interface QueueItem {
  appointment_id: string;
  token_number: number;
  status: QueueStatus;
  room_number?: string;
  called_at?: string;
}

export const appointmentsApi = {
  async list(filters?: {
    doctor_id?: string;
    patient_id?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Promise<AppointmentItem[]> {
    const query = new URLSearchParams();
    if (filters?.doctor_id) query.set("doctor_id", filters.doctor_id);
    if (filters?.patient_id) query.set("patient_id", filters.patient_id);
    if (filters?.date) query.set("date", filters.date);
    if (filters?.status) query.set("status", filters.status);

    const qs = query.toString();
    const res = await http.get<AppointmentItem[]>(`/appointments/${qs ? `?${qs}` : ""}`);
    return Array.isArray(res) ? res : [];
  },

  async book(payload: BookAppointmentPayload): Promise<any> {
    return http.post("/appointments/", payload);
  },

  async getDailyQueue(date?: string, doctorId?: string): Promise<QueueItem[]> {
    const query = new URLSearchParams();
    if (date) query.set("date", date);
    if (doctorId) query.set("doctor_id", doctorId);

    const qs = query.toString();
    const res = await http.get<QueueItem[]>(`/appointments/queue${qs ? `?${qs}` : ""}`);
    return Array.isArray(res) ? res : [];
  },

  async updateQueueStatus(appointmentId: string, status: QueueStatus, roomNumber?: string): Promise<any> {
    return http.post(`/appointments/${appointmentId}/queue-status`, { status, room_number: roomNumber });
  },
};
