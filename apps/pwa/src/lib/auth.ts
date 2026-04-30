import { apiFetch } from "./client";
import type { AuthResponse, LoginCredentials, RegisterData } from "@/lib/types";

/** Login do usuário */
export const login = (credentials: LoginCredentials) =>
  apiFetch<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

/** Registro de novo usuário */
export const register = (data: RegisterData) =>
  apiFetch<AuthResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Busca dados do usuário autenticado */
export const getMe = () => apiFetch<AuthResponse["user"]>(`/auth/me`);

/** Logout (invalida o token no backend) */
export const logoutApi = () =>
  apiFetch<void>(`/auth/logout`, { method: "POST" });
