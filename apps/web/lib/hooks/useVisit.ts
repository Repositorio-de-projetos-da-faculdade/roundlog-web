"use client";

import { useQuery } from "@tanstack/react-query";
import { getVisit } from "@/lib/api/visits";

/**
 * Hook para buscar uma visita por ID.
 * Faz polling automático a cada 3s enquanto a visita estiver processando.
 */
export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: () => getVisit(id),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 3000 : false,
  });
}
