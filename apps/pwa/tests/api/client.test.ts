import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch, ApiError } from "../../src/lib/api/client";
import { useAuthStore } from "../../src/lib/stores/authStore";

const sampleUser = {
  id: "u1",
  name: "Maria",
  email: "maria@h.com",
  role: "NURSE" as const,
  hospitalId: "h1",
};

beforeEach(() => {
  useAuthStore.getState().logout();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("apiFetch (PWA)", () => {
  it("envia Authorization + credentials include", async () => {
    useAuthStore.getState().setAuth(sampleUser, "tok-abc");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, {}));
    await apiFetch("/x");
    const [, init] = fetchSpy.mock.calls[0];
    expect((init?.headers as Record<string, string>)?.Authorization).toBe("Bearer tok-abc");
    expect(init?.credentials).toBe("include");
  });

  it("lança ApiError em 400+", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("bad", { status: 400 }));
    await expect(apiFetch("/x")).rejects.toBeInstanceOf(ApiError);
  });

  it("refresh + retry em 401", async () => {
    useAuthStore.getState().setAuth(sampleUser, "old");
    const spy = vi.spyOn(global, "fetch");
    spy.mockResolvedValueOnce(jsonResponse(401, {}));
    spy.mockResolvedValueOnce(jsonResponse(200, { token: "new" }));
    spy.mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const r = await apiFetch<{ ok: boolean }>("/wards");
    expect(r).toEqual({ ok: true });
    expect(useAuthStore.getState().token).toBe("new");
  });

  it("não tenta refresh em /auth/*", async () => {
    const spy = vi.spyOn(global, "fetch").mockResolvedValue(jsonResponse(401, {}));
    await expect(apiFetch("/auth/login")).rejects.toBeInstanceOf(ApiError);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
