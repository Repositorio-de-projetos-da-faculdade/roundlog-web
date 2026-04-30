import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — RoundLog",
  description: "Acesse sua conta RoundLog para gerenciar visitas médicas e condutas clínicas.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
