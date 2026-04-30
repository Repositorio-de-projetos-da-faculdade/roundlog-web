import { apiFetch } from "./client";
import type { AuthResponse, LoginCredentials, RegisterData } from "@/lib/types";

/**
 * MOCKS para desenvolvimento sem backend
 */
const MOCK_USER = {
  id: "user-1",
  name: "Dr. Ricardo Oliveira",
  email: "medico@roundlog.com",
  role: "doctor" as const,
  hospitalId: "hosp-1",
  wardIds: ["ward-1"],
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};

/** Login do usuário (com Mock para Dev) */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Em desenvolvimento, se o backend não estiver rodando, retornamos o mock
  if (process.env.NODE_ENV === "development") {
    console.log("[Mock API] Efetuando login simulado...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: MOCK_USER,
          token: "mock-jwt-token",
        });
      }, 800); // simula latência de rede
    });
  }

  return apiFetch<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

/** Registro de novo usuário */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  if (process.env.NODE_ENV === "development") {
    return { user: { ...MOCK_USER, ...data, id: "new-user" }, token: "mock-jwt-token" };
  }
  return apiFetch<AuthResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/** Busca dados do usuário autenticado */
export const getMe = () => apiFetch<AuthResponse["user"]>(`/auth/me`);

/** Logout */
export const logoutApi = () => apiFetch<void>(`/auth/logout`, { method: "POST" });
