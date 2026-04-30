export type UserRole = "doctor" | "nurse" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crm?: string; // Registro do médico
  coren?: string; // Registro da enfermagem
  hospitalId: string;
  wardIds: string[]; // Alas em que o usuário atua
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hospitalId: string;
}
