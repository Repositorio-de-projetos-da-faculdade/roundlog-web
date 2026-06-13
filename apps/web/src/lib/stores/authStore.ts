import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  hospitalId: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Auth state — apenas access token. Refresh token vive em cookie HttpOnly
 * (não acessível ao JS), gerenciado pela API.
 */
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

      setToken: (token) => set({ token }),

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
      name: "roundlog-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        hospitalId: state.hospitalId,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/** Helpers para uso fora de componentes React (ex: apiFetch). */
export function getTokenFromStore(): string | null {
  return useAuthStore.getState().token;
}

export function setTokenInStore(token: string): void {
  useAuthStore.getState().setToken(token);
}

export function logoutFromStore(): void {
  useAuthStore.getState().logout();
}
