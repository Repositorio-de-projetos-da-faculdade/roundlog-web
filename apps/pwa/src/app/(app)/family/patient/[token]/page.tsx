"use client";

import { FamilyUpdateCard } from "@/components/mobile/FamilyUpdateCard";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MessageCircle } from "lucide-react";

export default function FamilyPatientPage() {
  // Mock de dados para demonstração conforme o README
  const mockUpdate = {
    id: "up-1",
    updateText: "O paciente apresentou melhora no padrão respiratório após ajuste da medicação. Segue estável e em desmame de oxigênio.",
    timestamp: new Date().toISOString(),
    author: "Equipe Médica - RoundLog",
    status: "improving" as const
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <header className="text-center space-y-2 pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
          <Heart className="h-8 w-8 fill-current" />
        </div>
        <h1 className="text-2xl font-bold">Olá, Família</h1>
        <p className="text-sm text-muted-foreground">Acompanhe as atualizações de Maria das Dores</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="h-5 w-5 text-blue-500 mb-2" />
          <p className="text-[10px] uppercase font-bold text-slate-400">Internação</p>
          <p className="text-sm font-semibold">12 Mai, 2024</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <MessageCircle className="h-5 w-5 text-green-500 mb-2" />
          <p className="text-[10px] uppercase font-bold text-slate-400">Status Geral</p>
          <p className="text-sm font-semibold text-green-600">Melhorando</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold px-1">Últimas Atualizações</h2>
        <FamilyUpdateCard update={mockUpdate} />
      </section>

      <div className="p-4 rounded-2xl bg-primary text-primary-foreground text-center space-y-2 shadow-lg">
        <p className="text-sm font-medium">Deseja falar com a equipe?</p>
        <p className="text-xs opacity-80 italic">O horário de boletim médico é às 15:00h.</p>
      </div>
    </div>
  );
}
