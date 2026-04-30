import { Admission } from "./patient";
import { User } from "./user";

export type VisitStatus = "processing" | "ready" | "failed";

export interface Conduct {
  id: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "executed" | "cancelled" | "resolved" | "in_progress";
  deadline?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
}

export interface ClinicalAlert {
  id: string;
  type: "warning" | "critical" | "info";
  category: "allergy" | "interaction" | "vital_sign" | "lab_result" | "other";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  detectedAt: string;
  acknowledgedAt?: string | null;
}

export interface Visit {
  id: string;
  admissionId: string;
  admission?: Admission;
  doctorId: string;
  doctor?: User;
  audioUrl?: string;
  summary: string;
  status: VisitStatus;
  conducts: Conduct[];
  alerts: ClinicalAlert[];
  createdAt: string;
  updatedAt: string;
}
