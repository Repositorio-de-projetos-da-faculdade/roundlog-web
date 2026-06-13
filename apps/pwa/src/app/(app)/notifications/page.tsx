"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type InAppNotification,
} from "@/lib/api/notifications";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/layout/LoadingState";
import { EmptyState } from "@/components/layout/EmptyState";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 30;

/** Formata a data de criação como tempo relativo curto em pt-BR. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `há ${days} d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => getNotifications({ skip: 0, take: PAGE_SIZE }),
  });

  function invalidateNotifications() {
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: invalidateNotifications,
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: invalidateNotifications,
  });

  function handleOpen(n: InAppNotification) {
    if (n.readAt === null) {
      markReadMutation.mutate(n.id);
    }
    if (n.url) {
      router.push(n.url);
    }
  }

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Notificações</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={unreadCount === 0 || markAllMutation.isPending}
          onClick={() => markAllMutation.mutate()}
        >
          <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Marcar todas como lidas
        </Button>
      </div>

      {isLoading ? (
        <LoadingState rows={5} />
      ) : isError ? (
        <EmptyState
          icon={Bell}
          title="Não foi possível carregar"
          description="Tente novamente em instantes."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhuma notificação"
          description="Você está em dia. Novas notificações aparecerão aqui."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const isUnread = n.readAt === null;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => handleOpen(n)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border bg-white p-3 text-left transition-colors hover:bg-muted/40",
                    isUnread && "border-primary/30 bg-primary/5",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      isUnread ? "bg-primary" : "bg-transparent",
                    )}
                  />
                  <span className="min-w-0 flex-1 space-y-0.5">
                    <span className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm",
                          isUnread ? "font-semibold" : "font-medium",
                        )}
                      >
                        {n.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {relativeTime(n.createdAt)}
                      </span>
                    </span>
                    {n.body && (
                      <span className="block text-xs text-muted-foreground">
                        {n.body}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
