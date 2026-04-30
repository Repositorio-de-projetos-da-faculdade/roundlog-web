"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/uiStore";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import {
  LayoutDashboard,
  Stethoscope,
  BedDouble,
  ArrowLeftRight,
  Users,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["doctor", "nurse", "manager", "admin"],
  },
  {
    label: "Visitas",
    href: "/visits",
    icon: Stethoscope,
    roles: ["doctor", "admin"],
  },
  {
    label: "Alas",
    href: "/wards",
    icon: BedDouble,
    roles: ["nurse", "manager", "admin"],
  },
  {
    label: "Plantão",
    href: "/handoffs",
    icon: ArrowLeftRight,
    roles: ["nurse", "admin"],
  },
  {
    label: "Pacientes",
    href: "/patients",
    icon: Users,
    roles: ["doctor", "nurse", "manager", "admin"],
  },
  {
    label: "Gestão",
    href: "/analytics",
    icon: BarChart3,
    roles: ["manager", "admin"],
  },
  {
    label: "Near-misses",
    href: "/near-misses",
    icon: AlertTriangle,
    roles: ["manager", "admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const user = useCurrentUser();

  const visibleItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              RL
            </div>
            <span className="font-semibold text-sidebar-foreground">
              RoundLog
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-sidebar-foreground"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              !sidebarOpen && "rotate-180"
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
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
