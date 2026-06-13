// Ward, Bed e dashboard alinhados com API.
import type { Admission } from "./patient";
import type { Conduct, ClinicalAlert, Visit } from "./visit";

export interface Ward {
  id: string;
  hospitalId: string;
  name: string;
  floor?: string | null;
  specialty?: string | null;
}

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export interface Bed {
  id: string;
  wardId: string;
  code: string;
  status: BedStatus;
}

/** Bed conforme retornado pelo dashboard de enfermagem (/wards/:id/dashboard). */
export interface DashboardBed extends Bed {
  admissions: Array<
    Admission & {
      patient: { id: string; name: string; dob: string; allergies: string[] };
      visits: Array<
        Pick<Visit, "id" | "status" | "startedAt"> & {
          conducts: Conduct[];
          pendings: Conduct[];
          alerts: ClinicalAlert[];
        }
      >;
    }
  >;
}

export interface ConductExecutionInput {
  shiftId: string;
  notes?: string;
  status: "done" | "partial" | "not_possible";
}
