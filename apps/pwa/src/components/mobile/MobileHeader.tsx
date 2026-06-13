"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PushToggle } from "@/components/mobile/PushToggle";
import { useAuthStore } from "@/lib/stores/authStore";
import { logoutApi } from "@/lib/api/auth";

/** Iniciais do nome do usuário (até 2 letras) para o avatar. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Header autenticado do PWA: marca, menu do usuário (com logout) e toggle de push.
 */
export function MobileHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logoutApi();
    useAuthStore.getState().logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-2">
      <span className="text-sm font-semibold">RoundLog</span>

      <div className="flex items-center gap-2">
        <PushToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu do usuário"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {user ? initials(user.name) : <UserIcon className="h-4 w-4" aria-hidden="true" />}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={6}>
            {user && (
              <>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              variant="destructive"
              disabled={loggingOut}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {loggingOut ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
