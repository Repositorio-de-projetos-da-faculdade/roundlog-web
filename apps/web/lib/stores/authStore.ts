import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  hospitalId: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hospitalId: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          hospitalId: user.hospitalId,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          hospitalId: null,
          isAuthenticated: false,
        }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "roundlog-auth", // chave no localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        hospitalId: state.hospitalId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Helper para obter o token fora de componentes React (ex: no api client).
 * Usa o getState() do Zustand diretamente.
 */
export function getTokenFromStore(): string | null {
  return useAuthStore.getState().token;
}
