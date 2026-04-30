"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const { isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !token)) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, token, router]);

  // Evita flash de conteúdo antes da verificação
  if (!mounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 transition-all duration-300 p-6",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
