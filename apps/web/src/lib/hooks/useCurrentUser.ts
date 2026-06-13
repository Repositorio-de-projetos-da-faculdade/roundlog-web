"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import type { User } from "@/lib/types";

/**
 * Hook para acessar o usuário autenticado.
 * Retorna null se não estiver autenticado.
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}

/**
 * Hook para verificar se o usuário tem uma role específica.
 */
export function useHasRole(role: User["role"]): boolean {
  const user = useCurrentUser();
  return user?.role === role;
}
