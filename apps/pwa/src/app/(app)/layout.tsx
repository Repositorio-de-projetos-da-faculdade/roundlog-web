"use client";

import { Providers } from "@/components/providers";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      <main className="flex-1 pb-20 p-4">{children}</main>
      
      {/* Tab Bar Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-6 pb-2 safe-area-inset-bottom">
        {/* Adicione itens de navegação aqui */}
      </nav>
    </div>
  );
}
