import { apiFetch } from "./client";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = (credentials: LoginCredentials) =>
  apiFetch<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const register = (data: RegisterData) =>
  apiFetch<User>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutApi = async (): Promise<void> => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  } catch {
    // Best effort
  }
};
