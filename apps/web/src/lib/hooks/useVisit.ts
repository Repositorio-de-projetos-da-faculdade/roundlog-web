"use client";

import { useQuery } from "@tanstack/react-query";
import { getVisit } from "@/lib/api/visits";

/**
 * Hook para buscar uma visita por ID.
 * Faz polling automático a cada 3s enquanto a visita estiver PROCESSING ou RECORDING.
 */
export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: () => getVisit(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PROCESSING" || status === "RECORDING" ? 3000 : false;
    },
  });
}
