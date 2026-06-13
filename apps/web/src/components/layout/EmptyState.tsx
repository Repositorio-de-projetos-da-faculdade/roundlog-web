import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  /** Ícone Lucide. Default: Inbox. */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Ação opcional — passe um <Button> ou <Link>. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Estado vazio padronizado: ícone + título + descrição opcional + CTA opcional.
 * Substitui textos cinza soltos ("Nenhum X encontrado.").
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-lg border border-dashed bg-muted/30 px-6 py-10 gap-3 ${
        className ?? ""
      }`}
      role="status"
    >
      <div className="rounded-full bg-background p-3 text-muted-foreground">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
