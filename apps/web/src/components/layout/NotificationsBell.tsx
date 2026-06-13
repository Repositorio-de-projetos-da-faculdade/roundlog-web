"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Sino de notificações in-app no header. Faz polling a cada 60s,
 * mostra badge de não-lidas, abre painel com lista (marca como lida ao clicar).
 */
export function NotificationsBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ take: 20 }),
    refetchInterval: 60_000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // Fecha quando clica fora
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notificações${unread > 0 ? ` (${unread} não lidas)` : ""}`}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center px-1"
            aria-hidden="true"
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Lista de notificações"
          className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-hidden rounded-lg border bg-popover shadow-lg z-50 flex flex-col"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-sm font-semibold">Notificações</p>
            {unread > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="gap-1.5 text-xs h-7"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas
              </Button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Sem notificações.
              </p>
            ) : (
              <ul className="divide-y">
                {items.map((n) => {
                  const body = (
                    <div className="flex items-start gap-3 px-3 py-3 hover:bg-muted/50 transition cursor-pointer">
                      <span
                        className={`mt-1.5 inline-block h-2 w-2 rounded-full shrink-0 ${
                          n.readAt ? "bg-transparent" : "bg-blue-500"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(n.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      {!n.readAt && (
                        <Badge variant="secondary" className="text-[10px]">
                          Nova
                        </Badge>
                      )}
                    </div>
                  );
                  return (
                    <li key={n.id}>
                      {n.url ? (
                        <Link
                          href={n.url}
                          onClick={() => {
                            if (!n.readAt) markRead.mutate(n.id);
                            setOpen(false);
                          }}
                        >
                          {body}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => {
                            if (!n.readAt) markRead.mutate(n.id);
                          }}
                        >
                          {body}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
