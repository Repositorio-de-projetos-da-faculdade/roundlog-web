import type { FamilyUpdate, FamilyMessage } from "@/lib/types";

// O portal familiar não usa JWT — chama a API direto com o token na URL.
// Não pode usar apiFetch (que injeta Bearer e tenta refresh).
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function familyFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Family API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Validação básica do token antes de bater na API. */
export function isValidFamilyToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{16,128}$/.test(token);
}

export interface FamilyTimelinePoint {
  date: string; // YYYY-MM-DD
  visits: number;
  updates: number;
}

export interface FamilyOverview {
  patient: {
    name: string;
    age: number;
    bloodType: string | null;
    allergies: string[];
  };
  admission: {
    admittedAt: string;
    dischargedAt: string | null;
    status: "ACTIVE" | "DISCHARGED";
    diagnosis: string | null;
    daysAdmitted: number;
    ward: string;
    bed: string;
  };
  stats: {
    totalVisits: number;
    lastVisitAt: string | null;
    updatesCount: number;
    conductsResolved: number;
    conductsTotal: number;
  };
  timeline: FamilyTimelinePoint[];
  recentUpdates: Array<{
    id: string;
    contentLay: string;
    generatedAt: string;
  }>;
}

export const getFamilyOverview = (token: string) =>
  familyFetch<FamilyOverview>(`/family/patient/${token}/overview`);

export const getFamilyUpdates = (token: string) =>
  familyFetch<FamilyUpdate[]>(`/family/patient/${token}/updates`);

export const getFamilySummary = (token: string) =>
  familyFetch<{
    patientName: string;
    summary: string;
    generatedAt: string | null;
  }>(`/family/patient/${token}/summary`);

export const sendFamilyMessage = (token: string, content: string) =>
  familyFetch<FamilyMessage>(`/family/patient/${token}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
