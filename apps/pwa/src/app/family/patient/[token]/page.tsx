"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFamilyOverview,
  sendFamilyMessage,
  isValidFamilyToken,
} from "@/lib/api/family";
import { PatientHero } from "@/components/family/PatientHero";
import { StatCard } from "@/components/family/StatCard";
import { EvolutionChart } from "@/components/family/EvolutionChart";
import { CareProgress } from "@/components/family/CareProgress";
import { UpdateTimeline } from "@/components/family/UpdateTimeline";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  AlertCircle,
  Send,
  Loader2,
  CalendarDays,
  Stethoscope,
  Clock,
  Bell,
} from "lucide-react";

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const min = Math.round((Date.now() - date.getTime()) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} ${d === 1 ? "dia" : "dias"}`;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}

export default function FamilyPatientPage() {
  const { token: rawToken } = useParams<{ token: string }>();
  const token = rawToken ?? "";
  const validToken = isValidFamilyToken(token);

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const qc = useQueryClient();

  const overview = useQuery({
    queryKey: ["family-overview", token],
    queryFn: () => getFamilyOverview(token),
    enabled: validToken,
  });

  const sendMut = useMutation({
    mutationFn: (content: string) => sendFamilyMessage(token, content),
    onSuccess: () => {
      setMessage("");
      setSent(true);
      qc.invalidateQueries({ queryKey: ["family-overview", token] });
      setTimeout(() => setSent(false), 4000);
    },
  });

  if (!validToken) {
    return (
      <div className="space-y-3 pt-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Link inválido</h1>
        <p className="text-sm text-slate-500">
          O endereço de acesso parece estar incorreto. Verifique com a equipe
          assistencial.
        </p>
      </div>
    );
  }

  if (overview.isLoading) {
    return <DashboardSkeleton />;
  }

  if (overview.error || !overview.data) {
    return (
      <div className="space-y-3 pt-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">
          Não foi possível carregar
        </h1>
        <p className="text-sm text-slate-500">
          Tivemos um problema ao buscar as informações. Tente novamente em
          instantes.
        </p>
        <Button
          variant="outline"
          onClick={() => overview.refetch()}
          className="mt-2"
        >
          Tentar de novo
        </Button>
      </div>
    );
  }

  const { patient, admission, stats, timeline, recentUpdates } = overview.data;

  return (
    <div className="space-y-5">
      <PatientHero patient={patient} admission={admission} />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={CalendarDays}
          label="Dias internado"
          value={String(admission.daysAdmitted)}
          accent="text-rose-500"
        />
        <StatCard
          icon={Stethoscope}
          label="Visitas médicas"
          value={String(stats.totalVisits)}
          accent="text-sky-500"
        />
        <StatCard
          icon={Clock}
          label="Última atualização"
          value={relativeTime(stats.lastVisitAt)}
          accent="text-amber-500"
        />
        <StatCard
          icon={Bell}
          label="Atualizações"
          value={String(stats.updatesCount)}
          accent="text-emerald-500"
        />
      </div>

      <EvolutionChart timeline={timeline} />

      <CareProgress
        resolved={stats.conductsResolved}
        total={stats.conductsTotal}
      />

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 px-1 text-base font-bold text-slate-800">
          <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
          Linha do tempo
        </h2>
        <UpdateTimeline updates={recentUpdates} />
      </section>

      <section className="space-y-2">
        <h2 className="flex items-center gap-2 px-1 text-base font-bold text-slate-800">
          <MessageCircle className="h-4 w-4 text-rose-500" />
          Falar com a equipe
        </h2>
        <p className="px-1 text-xs text-slate-500">
          Envie uma mensagem e a equipe assistencial responderá assim que
          possível.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva sua mensagem..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          maxLength={2000}
        />
        <Button
          onClick={() => sendMut.mutate(message)}
          disabled={!message.trim() || sendMut.isPending}
          className="w-full gap-2 bg-rose-500 hover:bg-rose-600"
        >
          {sendMut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Enviar
        </Button>
        {sent && (
          <p className="text-center text-xs text-emerald-600">
            Mensagem enviada à equipe ✓
          </p>
        )}
      </section>
    </div>
  );
}
