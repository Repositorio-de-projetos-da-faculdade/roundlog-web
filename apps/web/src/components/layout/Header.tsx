"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUIStore } from "@/lib/stores/uiStore";
import { logoutApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationsBell } from "./NotificationsBell";

export function Header() {
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const { sidebarOpen, theme, setTheme } = useUIStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutApi();
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <header
      className={cn(
        "fixed top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6 transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16",
        "right-0",
      )}
    >
      <div id="header-breadcrumb-portal" />

      <div className="flex items-center gap-3">
        <NotificationsBell />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
          aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menu do usuário"
            className="flex items-center gap-2 px-2 rounded-md hover:bg-accent h-10 outline-none cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            {user && (
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
