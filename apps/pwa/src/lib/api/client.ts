import { getTokenFromStore } from "@/lib/stores/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Custom API error com status HTTP e body da resposta.
 */
export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`API Error ${status}: ${body}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Wrapper de fetch com injeção automática de token e tratamento de erro.
 * Todo fetch com a API DEVE usar esta função.
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getTokenFromStore();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  // Se o body é FormData, remove Content-Type para deixar o browser setar o boundary
  if (options?.body instanceof FormData) {
    delete (headers as Record<string, string>)["Content-Type"];
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body);
  }

  // Retorna void para respostas 204 (No Content)
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
