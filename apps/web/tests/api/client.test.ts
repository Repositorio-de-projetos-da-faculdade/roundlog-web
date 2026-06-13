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

describe("apiFetch", () => {
  it("envia Authorization quando há token", async () => {
    useAuthStore.getState().setAuth(sampleUser, "tok-abc");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      jsonResponse(200, { ok: true }),
    );

    await apiFetch("/anything");

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [, init] = fetchSpy.mock.calls[0];
    expect((init?.headers as Record<string, string>)?.Authorization).toBe("Bearer tok-abc");
    expect(init?.credentials).toBe("include");
  });

  it("não envia Authorization quando não há token", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(jsonResponse(200, {}));
    await apiFetch("/x");
    const [, init] = fetchSpy.mock.calls[0];
    expect((init?.headers as Record<string, string>)?.Authorization).toBeUndefined();
  });

  it("lança ApiError em status >= 400", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("bad", { status: 400 }),
    );
    await expect(apiFetch("/x")).rejects.toBeInstanceOf(ApiError);
  });

  it("retorna undefined em 204", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    const result = await apiFetch("/x");
    expect(result).toBeUndefined();
  });

  it("em 401, tenta refresh e refaz a request com novo token", async () => {
    useAuthStore.getState().setAuth(sampleUser, "old-token");
    const fetchSpy = vi.spyOn(global, "fetch");

    // 1) request original: 401
    fetchSpy.mockResolvedValueOnce(jsonResponse(401, { error: "expirado" }));
    // 2) /auth/refresh: 200 com novo token
    fetchSpy.mockResolvedValueOnce(jsonResponse(200, { token: "new-token" }));
    // 3) retry da request original: 200
    fetchSpy.mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const result = await apiFetch<{ ok: boolean }>("/wards");

    expect(result).toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    // 2ª chamada = refresh
    expect(fetchSpy.mock.calls[1][0]).toContain("/auth/refresh");
    // store atualizado
    expect(useAuthStore.getState().token).toBe("new-token");
    // 3ª chamada deve usar novo token
    expect(
      (fetchSpy.mock.calls[2][1]?.headers as Record<string, string>)?.Authorization,
    ).toBe("Bearer new-token");
  });

  it("se refresh falha, faz logout e lança 401", async () => {
    useAuthStore.getState().setAuth(sampleUser, "old-token");
    const fetchSpy = vi.spyOn(global, "fetch");

    fetchSpy.mockResolvedValueOnce(jsonResponse(401, {}));
    fetchSpy.mockResolvedValueOnce(jsonResponse(401, { error: "rejeitado" }));

    await expect(apiFetch("/wards")).rejects.toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBe(null);
  });

  it("não tenta refresh em rotas /auth/", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(jsonResponse(401, {}));
    await expect(apiFetch("/auth/login")).rejects.toBeInstanceOf(ApiError);
    // só uma chamada — não tentou refresh
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
