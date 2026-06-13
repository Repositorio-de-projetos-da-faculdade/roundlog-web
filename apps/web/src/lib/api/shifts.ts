import { apiFetch } from "./client";
import type { ShiftType } from "@/lib/types";

export interface NursingShift {
  id: string;
  wardId: string;
  nurseId: string;
  type: ShiftType;
  startedAt: string;
  endedAt: string | null;
  nurse?: { id: string; name: string };
}

export const getWardShifts = (wardId: string, openOnly = false) =>
  apiFetch<NursingShift[]>(`/wards/${wardId}/shifts${openOnly ? "?open=true" : ""}`);

export const createShift = (data: { wardId: string; type: ShiftType }) =>
  apiFetch<NursingShift>(`/shifts`, { method: "POST", body: JSON.stringify(data) });

export const closeShift = (id: string) =>
  apiFetch<NursingShift>(`/shifts/${id}/close`, { method: "PATCH" });
