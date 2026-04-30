import { apiFetch } from "./client";
import type { Patient, Admission } from "@/lib/types";

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p-1",
    name: "Maria das Dores",
    dateOfBirth: "1955-05-12",
    gender: "female",
    medicalRecordNumber: "MRN-8821",
    allergies: ["Dipirona"],
    comorbidities: ["HAS", "DM2"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-2",
    name: "João dos Santos",
    dateOfBirth: "1980-10-25",
    gender: "male",
    medicalRecordNumber: "MRN-1045",
    allergies: [],
    comorbidities: ["Asma"],
    createdAt: new Date().toISOString(),
  },
];

const MOCK_ADMISSION: Admission = {
  id: "adm-1",
  patientId: "p-1",
  patient: MOCK_PATIENTS[0],
  wardId: "ward-1",
  bedNumber: "204-A",
  admittedAt: new Date().toISOString(),
  dischargedAt: null,
  diagnosis: "Pneumonia Comunitária",
  attendingDoctorId: "user-1",
  attendingDoctorName: "Dr. Ricardo Oliveira",
  status: "active",
};

export const getPatients = async (search?: string) => {
  if (process.env.NODE_ENV === "development") {
    return MOCK_PATIENTS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  }
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch<Patient[]>(`/patients${params}`);
};

export const getPatient = async (id: string) => {
  if (process.env.NODE_ENV === "development") return MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
  return apiFetch<Patient>(`/patients/${id}`);
};

export const getAdmission = async (id: string) => {
  if (process.env.NODE_ENV === "development") return MOCK_ADMISSION;
  return apiFetch<Admission>(`/admissions/${id}`);
};

export const getActiveAdmissions = (patientId: string) =>
  apiFetch<Admission[]>(`/patients/${patientId}/admissions?status=active`);
