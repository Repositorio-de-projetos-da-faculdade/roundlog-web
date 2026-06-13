"use client";

import { useQuery } from "@tanstack/react-query";
import { getVisit } from "@/lib/api/visits";

/**
 * Hook para buscar uma visita por ID.
 * Polling a cada 3s enquanto PROCESSING ou RECORDING.
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
