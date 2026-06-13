import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  /** Quantas linhas de skeleton renderizar (default 3) */
  rows?: number;
  /** Se true, renderiza em grid de cards (4 cols md). Default: stack. */
  grid?: boolean;
  className?: string;
}

/**
 * Skeleton padronizado para listas e dashboards. Usar em vez de "Carregando..."
 * solto. Para visões muito específicas (ex.: tabela), montar skeleton inline.
 */
export function LoadingState({ rows = 3, grid = false, className }: LoadingStateProps) {
  const items = Array.from({ length: rows });
  if (grid) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className ?? ""}`}>
        {items.map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      {items.map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
