"use client";

import { useQuery } from "@tanstack/react-query";
import { getWardDashboard } from "@/lib/api/wards";

/**
 * Hook para o dashboard de ala com polling a cada 30s.
 * Mantém os dados frescos para a enfermagem.
 */
export function useWardDashboard(wardId: string) {
  return useQuery({
    queryKey: ["ward-dashboard", wardId],
    queryFn: () => getWardDashboard(wardId),
    enabled: !!wardId,
    refetchInterval: 30_000, // atualiza a cada 30 segundos
    staleTime: 20_000,
  });
}
