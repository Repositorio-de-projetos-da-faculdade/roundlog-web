import { apiFetch } from "./client";
import type { Ward, WardDashboard, ConductExecution } from "@/lib/types";

const MOCK_WARDS: Ward[] = [
  { id: "ward-1", name: "UTI Adulto", hospitalId: "hosp-1", floor: "3", totalBeds: 20, activeBeds: 18 },
  { id: "ward-2", name: "Enfermaria Clínica", hospitalId: "hosp-1", floor: "2", totalBeds: 30, activeBeds: 25 },
];

const MOCK_DASHBOARD: WardDashboard = {
  ward: MOCK_WARDS[0],
  beds: [
    {
      id: "b-1",
      number: "201",
      wardId: "ward-1",
      status: "occupied",
      admission: {
        id: "adm-1",
        patientId: "p-1",
        patient: { name: "Maria das Dores", id: "p-1", dateOfBirth: "1955", gender: "female", medicalRecordNumber: "1", allergies: [], comorbidities: [], createdAt: "" },
        wardId: "ward-1",
        bedNumber: "201",
        admittedAt: "",
        dischargedAt: null,
        diagnosis: "Insuficiência Respiratória",
        attendingDoctorId: "d-1",
        attendingDoctorName: "Dr. Ricardo",
        status: "active"
      },
      pendingConducts: [
        { id: "c-1", description: "Ajustar sedação", priority: "high", deadline: null, status: "open", resolvedBy: null, resolvedAt: null }
      ],
      lastVisitAt: new Date().toISOString(),
      alerts: 1
    },
    { id: "b-2", number: "202", wardId: "ward-1", status: "available", admission: null, pendingConducts: [], lastVisitAt: null, alerts: 0 },
  ],
  stats: {
    totalPatients: 18,
    pendingConducts: 12,
    criticalAlerts: 2,
    visitsToday: 15,
    executionRate: 85
  },
  currentShift: "morning"
};

/** Lista alas do hospital */
export const getWards = async () => {
  if (process.env.NODE_ENV === "development") return MOCK_WARDS;
  return apiFetch<Ward[]>(`/wards`);
};

/** Busca uma ala por ID */
export const getWard = async (id: string) => {
  if (process.env.NODE_ENV === "development") return MOCK_WARDS.find(w => w.id === id) || MOCK_WARDS[0];
  return apiFetch<Ward>(`/wards/${id}`);
};

/** Busca dashboard completo de uma ala */
export const getWardDashboard = async (wardId: string) => {
  if (process.env.NODE_ENV === "development") return MOCK_DASHBOARD;
  return apiFetch<WardDashboard>(`/wards/${wardId}/dashboard`);
};

/** Registra execução de conduta pela enfermagem */
export const executeConductInWard = (data: ConductExecution) =>
  apiFetch<void>(`/conducts/${data.conductId}/execute`, {
    method: "POST",
    body: JSON.stringify(data),
  });
