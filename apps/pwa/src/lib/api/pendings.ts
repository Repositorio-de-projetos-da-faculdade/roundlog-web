import { apiFetch } from "./client";
import type { Pending } from "@/lib/types";

/** Resolve uma pendência (lab, farmácia, etc.). */
export const resolvePending = (pendingId: string) =>
  apiFetch<Pending>(`/pendings/${pendingId}/resolve`, { method: "PATCH" });
