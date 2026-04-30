import { User } from "./user";
import { Patient } from "./patient";

export interface Handoff {
  id: string;
  wardId: string;
  senderId: string;
  sender?: User;
  receiverId?: string;
  receiver?: User;
  shift: "morning" | "afternoon" | "night";
  patientStates: {
    patientId: string;
    patient?: Patient;
    summary: string;
    criticalNotes?: string;
    isStable: boolean;
  }[];
  createdAt: string;
  acknowledgedAt?: string | null;
}
