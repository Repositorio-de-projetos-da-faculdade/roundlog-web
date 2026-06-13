import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  rows?: number;
  grid?: boolean;
  className?: string;
}

export function LoadingState({ rows = 3, grid = false, className }: LoadingStateProps) {
  const items = Array.from({ length: rows });
  if (grid) {
    return (
      <div className={`grid gap-3 grid-cols-1 ${className ?? ""}`}>
        {items.map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      {items.map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}
