"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { BottomNav } from "@/components/mobile/BottomNav";

export default function PwaLayout({ children }: { children: React.ReactNode }) {
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

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <MobileHeader />
      <main className="flex-1 pb-20 p-4">{children}</main>
      <BottomNav />
    </div>
  );
}
