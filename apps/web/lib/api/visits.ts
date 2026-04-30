import { apiFetch } from "./client";
import type { Visit } from "@/lib/types";

const MOCK_VISIT: Visit = {
  id: "1",
  admissionId: "adm-1",
  admission: {
    id: "adm-1",
    patientId: "p-1",
    patient: { name: "Maria das Dores", id: "p-1", dateOfBirth: "1955", gender: "female", medicalRecordNumber: "MRN-8821", allergies: ["Dipirona"], comorbidities: ["HAS"], createdAt: "" },
    wardId: "ward-1",
    bedNumber: "204-A",
    admittedAt: new Date().toISOString(),
    dischargedAt: null,
    diagnosis: "Pneumonia Comunitária",
    attendingDoctorId: "u-1",
    attendingDoctorName: "Dr. Ricardo",
    status: "active"
  },
  doctorId: "u-1",
  summary: "Paciente evoluindo com melhora clínica.",
  status: "ready",
  conducts: [
    { id: "c-1", description: "Trocar Ceftriaxone para Levofloxacino 500mg VO", priority: "high", status: "open", deadline: null, resolvedAt: null, resolvedBy: null },
    { id: "c-2", description: "Fisioterapia respiratória 2x ao dia", priority: "medium", status: "open", deadline: null, resolvedAt: null, resolvedBy: null }
  ],
  alerts: [
    { id: "a-1", type: "warning", category: "other", severity: "medium", message: "Monitorar saturação", detectedAt: new Date().toISOString() }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const getVisits = (admissionId?: string) => apiFetch<Visit[]>(`/visits${admissionId ? `?admissionId=${admissionId}` : ""}`);
export const getVisit = async (id: string) => (process.env.NODE_ENV === "development" ? MOCK_VISIT : apiFetch<Visit>(`/visits/${id}`));
export const createVisit = (admissionId: string) => apiFetch<Visit>(`/visits`, { method: "POST", body: JSON.stringify({ admissionId }) });
export const uploadAudio = (visitId: string, audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  return apiFetch<void>(`/visits/${visitId}/audio`, { method: "POST", body: formData });
};
