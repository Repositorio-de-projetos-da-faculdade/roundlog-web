export type VisitStatus = "recording" | "processing" | "ready" | "error";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Conduct {
  id: string;
  description: string;
  priority: Priority;
  deadline: string | null;
  status: "open" | "in_progress" | "resolved";
  resolvedBy: string | null;
  resolvedAt: string | null;
}

export interface Pending {
  id: string;
  description: string;
  type: "exam" | "procedure" | "medication" | "other";
  requestedAt: string;
  status: "pending" | "completed" | "cancelled";
  completedAt: string | null;
}

export interface ClinicalAlert {
  id: string;
  severity: Priority;
  message: string;
  category: "allergy" | "interaction" | "vital_sign" | "lab_result" | "other";
  createdAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
}

export interface VisitStructuredData {
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  additionalNotes: string | null;
}

export interface Visit {
  id: string;
  admissionId: string;
  doctorId: string;
  doctorName: string;
  status: VisitStatus;
  transcriptRaw: string | null;
  structuredJson: VisitStructuredData | null;
  startedAt: string;
  finishedAt: string | null;
  conducts: Conduct[];
  pendings: Pending[];
  alerts: ClinicalAlert[];
  prescriptions: Prescription[];
}
