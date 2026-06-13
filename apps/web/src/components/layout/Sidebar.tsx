"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/uiStore";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import {
  LayoutDashboard,
  ClipboardList,
  BedDouble,
  ArrowLeftRight,
  Users,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

// Roles em UPPERCASE — espelha Prisma enum da API.
const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["PHYSICIAN", "NURSE", "TECHNICIAN", "MANAGER", "ADMIN"],
  },
  {
    label: "Internações",
    href: "/admissions",
    icon: ClipboardList,
    roles: ["PHYSICIAN", "NURSE", "TECHNICIAN", "MANAGER", "ADMIN"],
  },
  {
    label: "Alas",
    href: "/wards",
    icon: BedDouble,
    roles: ["NURSE", "TECHNICIAN", "MANAGER", "ADMIN"],
  },
  {
    label: "Plantão",
    href: "/handoffs",
    icon: ArrowLeftRight,
    roles: ["NURSE", "ADMIN"],
  },
  {
    label: "Pacientes",
    href: "/patients",
    icon: Users,
    roles: ["PHYSICIAN", "NURSE", "TECHNICIAN", "MANAGER", "ADMIN"],
  },
  {
    label: "Gestão",
    href: "/analytics",
    icon: BarChart3,
    roles: ["MANAGER", "ADMIN"],
  },
  {
    label: "Quase-erros",
    href: "/near-misses",
    icon: AlertTriangle,
    roles: ["PHYSICIAN", "NURSE", "TECHNICIAN", "MANAGER", "ADMIN"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const user = useCurrentUser();

  // Sem user (ainda carregando) → mostra todos pra não piscar o menu.
  // Com user → filtra por role (UPPERCASE).
  const visibleItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role),
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              RL
            </div>
            <span className="font-semibold text-sidebar-foreground">RoundLog</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-sidebar-foreground"
          aria-label={sidebarOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
          aria-expanded={sidebarOpen}
        >
          <ChevronLeft
            aria-hidden="true"
            className={cn(
              "h-4 w-4 transition-transform",
              !sidebarOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
