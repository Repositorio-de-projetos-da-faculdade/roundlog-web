import { apiFetch } from "./client";
import type { Conduct } from "@/lib/types";

/**
 * Condutas em atraso (deadline no passado e status != RESOLVED), com paciente e leito.
 */
export interface OverdueConduct extends Conduct {
  visit: {
    admission: {
      patient: { id: string; name: string };
      bed: { id: string; code: string };
    };
  };
}

/** Lista condutas em atraso do hospital. */
export const getOverdueConducts = () =>
  apiFetch<OverdueConduct[]>(`/nursing/overdue`);
