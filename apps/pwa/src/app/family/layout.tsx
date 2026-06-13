import type { ReactNode } from "react";

/**
 * Layout público do portal da família.
 * NÃO exige autenticação e NÃO renderiza MobileHeader/BottomNav.
 * Apenas um container mobile centrado sobre fundo suave.
 */
export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-slate-50 to-slate-50">
      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-5">{children}</main>
    </div>
  );
}
