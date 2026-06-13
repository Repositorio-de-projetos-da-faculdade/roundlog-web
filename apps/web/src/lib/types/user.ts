// Tipos alinhados com Prisma enums (UPPERCASE) e payloads de /auth da API.
export type Role = "ADMIN" | "PHYSICIAN" | "NURSE" | "TECHNICIAN" | "MANAGER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  hospitalId: string;
  crm?: string | null;
  coren?: string | null;
  createdAt?: string;
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
  role: Role;
  hospitalId: string;
  crm?: string;
  coren?: string;
}
