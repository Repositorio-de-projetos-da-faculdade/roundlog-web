import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "../../src/lib/stores/authStore";

const sampleUser = {
  id: "u1",
  name: "Maria",
  email: "maria@h.com",
  role: "NURSE" as const,
  hospitalId: "h1",
};

describe("authStore (PWA)", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("setAuth + logout", () => {
    useAuthStore.getState().setAuth(sampleUser, "tok");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBe(null);
  });

  it("setToken atualiza só access token", () => {
    useAuthStore.getState().setAuth(sampleUser, "old");
    useAuthStore.getState().setToken("new");
    expect(useAuthStore.getState().token).toBe("new");
    expect(useAuthStore.getState().user).toEqual(sampleUser);
  });
});
