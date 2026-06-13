import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-xl border border-dashed bg-muted/30 px-6 py-8 gap-2 ${
        className ?? ""
      }`}
      role="status"
    >
      <div className="rounded-full bg-background p-2 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
