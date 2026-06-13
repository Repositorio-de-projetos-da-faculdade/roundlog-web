import { apiFetch } from "./client";
import type { Visit } from "@/lib/types";

/** Cria uma nova visita médica (status RECORDING) — apenas PHYSICIAN. */
export const createVisit = (admissionId: string) =>
  apiFetch<Visit>(`/visits`, {
    method: "POST",
    body: JSON.stringify({ admissionId }),
  });

/** Busca uma visita com condutas, pendências, alertas, prescrições. */
export const getVisit = (id: string) => apiFetch<Visit>(`/visits/${id}`);

/** Faz upload do áudio de uma visita (multipart). Backend retorna 202 e enfileira processamento. */
export const uploadAudio = (visitId: string, audioBlob: Blob, filename = "visit.webm") => {
  const formData = new FormData();
  formData.append("audio", audioBlob, filename);
  return apiFetch<{ status: string }>(`/visits/${visitId}/audio`, {
    method: "POST",
    body: formData,
  });
};
