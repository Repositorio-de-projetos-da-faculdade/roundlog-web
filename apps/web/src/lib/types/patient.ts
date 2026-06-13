// Patient e Admission espelhando schema.prisma da API.
export interface Patient {
  id: string;
  hospitalId: string;
  name: string;
  cpf: string;
  dob: string; // ISO date
  bloodType?: string | null;
  allergies: string[];
  createdAt: string;
}

export type AdmissionStatus = "ACTIVE" | "DISCHARGED";

export interface FamilyContact {
  id: string;
  admissionId: string;
  name: string;
  relationship: string;
  phone: string;
  accessToken: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patient?: Patient;
  bedId: string;
  admittedById: string;
  admittedAt: string;
  dischargedAt?: string | null;
  diagnosis?: string | null;
  status: AdmissionStatus;
  familyContacts?: FamilyContact[];
}
