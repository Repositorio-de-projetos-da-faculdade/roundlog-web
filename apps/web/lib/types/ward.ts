import { Visit, Conduct, ClinicalAlert } from "./visit";
import { Patient, Admission } from "./patient";

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
  status: "available" | "occupied" | "maintenance" | "cleaning";
  admissionId?: string | null;
  admission?: Admission | null;
  lastVisitAt?: string | null;
  pendingConducts: Conduct[];
  alerts: number;
}

export interface WardDashboard {
  ward: Ward;
  beds: Bed[];
  stats: {
    totalPatients: number;
    pendingConducts: number;
    criticalAlerts: number;
    visitsToday: number;
    executionRate: number;
  };
  currentShift: "morning" | "afternoon" | "night";
}

export interface ConductExecution {
  conductId: string;
  bedId: string;
  notes?: string;
  executedBy: string;
}
