export * from "./user";
export * from "./patient";
export * from "./visit";
export * from "./ward";
export * from "./handoff";

// Tipos da família (consumidos pelo portal sem JWT)
export interface FamilyUpdate {
  id: string;
  admissionId: string;
  visitId?: string | null;
  contentLay: string;
  generatedAt: string;
  readAt?: string | null;
}

export interface FamilyMessage {
  id: string;
  admissionId: string;
  fromFamily: boolean;
  content: string;
  sentAt: string;
  readAt?: string | null;
}

// Near miss
export interface NearMiss {
  id: string;
  hospitalId: string;
  wardId?: string | null;
  reportedAt: string;
  category: "medication" | "procedure" | "communication" | "equipment" | "fall";
  severity: "near_miss" | "no_harm" | "harm";
  description: string;
  aiClassificationJson?: unknown;
  isAnonymous: boolean;
}

// Analytics responses
export interface WardAnalytics {
  wardId: string;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  activeAdmissions: number;
}

export interface ComplianceMetrics {
  totalConducts: number;
  resolvedConducts: number;
  complianceRate: number;
}

export interface HandoffMetrics {
  totalHandoffs: number;
  acknowledgedHandoffs: number;
  ackRate: number;
}
