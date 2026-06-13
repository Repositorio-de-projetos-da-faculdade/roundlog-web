"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell, BedDouble, type LucideIcon } from "lucide-react";
import { getNotifications } from "@/lib/api/notifications";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Mostra badge de não-lidas (sino de notificações). */
  badge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  // "Pacientes" é a tela inicial — o médico escolhe ali quem visitar antes
  // de cair no gravador. Não dá pra deixar "Gravar" como tab direta porque
  // /record exige admissionId.
  { href: "/beds", label: "Pacientes", icon: BedDouble },
  { href: "/notifications", label: "Notificações", icon: Bell, badge: true },
];

/**
 * Tab bar fixa no rodapé do PWA. Marca o item ativo via pathname e
 * exibe um badge de notificações não-lidas no item de notificações.
 */
export function BottomNav() {
  const pathname = usePathname();

  const { data: unread } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => getNotifications({ unreadOnly: true, take: 1 }),
    refetchInterval: 60000,
  });

  const unreadCount = unread?.unreadCount ?? 0;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-20 h-16 bg-white border-t flex items-center justify-around px-6 pb-[env(safe-area-inset-bottom)]"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="relative">
              <Icon className="h-6 w-6" aria-hidden="true" />
              {item.badge && unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
