// Visit e descendentes alinhados com schema.prisma da API.
import type { Admission } from "./patient";

export type VisitStatus = "RECORDING" | "PROCESSING" | "READY" | "ERROR";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ConductStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Conduct {
  id: string;
  visitId: string;
  description: string;
  priority: Priority;
  deadlineAt?: string | null;
  status: ConductStatus;
  resolvedById?: string | null;
  resolvedAt?: string | null;
}

export interface Pending {
  id: string;
  visitId: string;
  description: string;
  assignedToRole?: string | null;
  status: ConductStatus;
  resolvedById?: string | null;
  resolvedAt?: string | null;
}

export interface ClinicalAlert {
  id: string;
  visitId: string;
  type: string; // drug_interaction | allergy | critical_value | fall_risk
  description: string;
  severity: string; // critical | warning | info
  acknowledgedById?: string | null;
  acknowledgedAt?: string | null;
}

export interface Prescription {
  id: string;
  visitId: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  duration?: string | null;
  notes?: string | null;
}

export interface VisitStructuredData {
  transcript: string;
  conducts: Array<{ description: string; priority: Priority; deadline_hours: number | null }>;
  pendings: Array<{ description: string; assigned_to: string }>;
  alerts: Array<{ type: string; severity: string; description: string }>;
  prescriptions: Array<{ medication: string; dose: string; route: string; frequency: string; duration: string }>;
}

export interface Visit {
  id: string;
  admissionId: string;
  admission?: Admission;
  physicianId: string;
  physician?: { id: string; name: string; crm?: string | null };
  status: VisitStatus;
  audioUrl?: string | null;
  transcriptRaw?: string | null;
  structuredJson?: VisitStructuredData | null;
  startedAt: string;
  finishedAt?: string | null;
  conducts: Conduct[];
  pendings: Pending[];
  alerts: ClinicalAlert[];
  prescriptions: Prescription[];
}
