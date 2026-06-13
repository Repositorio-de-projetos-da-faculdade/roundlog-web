import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "../../src/lib/stores/authStore";

const sampleUser = {
  id: "u1",
  name: "Maria",
  email: "maria@h.com",
  role: "NURSE" as const,
  hospitalId: "h1",
};

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("começa não autenticado", () => {
    const s = useAuthStore.getState();
    expect(s.user).toBe(null);
    expect(s.token).toBe(null);
    expect(s.isAuthenticated).toBe(false);
  });

  it("setAuth popula user/token/hospitalId/isAuthenticated", () => {
    useAuthStore.getState().setAuth(sampleUser, "access-token-xyz");
    const s = useAuthStore.getState();
    expect(s.user).toEqual(sampleUser);
    expect(s.token).toBe("access-token-xyz");
    expect(s.hospitalId).toBe("h1");
    expect(s.isAuthenticated).toBe(true);
  });

  it("setToken atualiza só o access token", () => {
    useAuthStore.getState().setAuth(sampleUser, "old");
    useAuthStore.getState().setToken("new");
    expect(useAuthStore.getState().token).toBe("new");
    expect(useAuthStore.getState().user).toEqual(sampleUser);
  });

  it("logout limpa tudo", () => {
    useAuthStore.getState().setAuth(sampleUser, "tok");
    useAuthStore.getState().logout();
    const s = useAuthStore.getState();
    expect(s.user).toBe(null);
    expect(s.token).toBe(null);
    expect(s.hospitalId).toBe(null);
    expect(s.isAuthenticated).toBe(false);
  });

  it("updateUser mescla campos", () => {
    useAuthStore.getState().setAuth(sampleUser, "tok");
    useAuthStore.getState().updateUser({ name: "Maria Silva" });
    expect(useAuthStore.getState().user?.name).toBe("Maria Silva");
    expect(useAuthStore.getState().user?.email).toBe("maria@h.com");
  });
});
