export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  medicalRecordNumber: string;
  allergies: string[];
  comorbidities: string[];
  createdAt: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patient: Patient;
  wardId: string;
  bedNumber: string;
  admittedAt: string;
  dischargedAt: string | null;
  diagnosis: string;
  attendingDoctorId: string;
  attendingDoctorName: string;
  status: "active" | "discharged" | "transferred";
}
