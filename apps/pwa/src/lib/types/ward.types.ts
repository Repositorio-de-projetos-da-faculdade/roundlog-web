import type { Priority, Conduct } from "./visit.types";
import type { Admission } from "./patient.types";

export interface Ward {
  id: string;
  name: string;
  hospitalId: string;
  floor: string;
  totalBeds: number;
  activeBeds: number;
}

export interface Bed {
  id: string;
  number: string;
  wardId: string;
  status: "available" | "occupied" | "maintenance";
  admission: Admission | null;
  pendingConducts: Conduct[];
  lastVisitAt: string | null;
  alerts: number; // contagem de alertas ativos
}

export interface WardDashboard {
  ward: Ward;
  beds: Bed[];
  stats: {
    totalPatients: number;
    pendingConducts: number;
    criticalAlerts: number;
    visitsToday: number;
    executionRate: number; // percentual de condutas executadas no turno
  };
  currentShift: "morning" | "afternoon" | "night";
}

export interface Handoff {
  id: string;
  wardId: string;
  fromShift: "morning" | "afternoon" | "night";
  toShift: "morning" | "afternoon" | "night";
  createdBy: string;
  createdAt: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  patients: HandoffPatient[];
}

export interface HandoffPatient {
  admissionId: string;
  patientName: string;
  bedNumber: string;
  summary: string;
  pendingConducts: Conduct[];
  criticalNotes: string | null;
}

export type ConductExecution = {
  conductId: string;
  executedBy: string;
  executedAt: string;
  notes: string;
};
