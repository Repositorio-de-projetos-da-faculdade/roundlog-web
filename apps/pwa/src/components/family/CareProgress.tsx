"use client";

import { ShieldCheck } from "lucide-react";

interface CareProgressProps {
  resolved: number;
  total: number;
}

export function CareProgress({ resolved, total }: CareProgressProps) {
  const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Donut via stroke-dasharray.
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  const message =
    total === 0
      ? "Assim que houver cuidados registrados, o progresso aparecerá aqui."
      : pct >= 100
        ? "Todos os cuidados planejados foram realizados. 💚"
        : "A equipe segue acompanhando de perto cada cuidado.";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Cuidados realizados
          </h2>
          <p className="text-[11px] text-slate-400">Evolução do plano de cuidados</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-[stroke-dasharray] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-800">{pct}%</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">
            {resolved} de {total}{" "}
            {total === 1 ? "cuidado concluído" : "cuidados concluídos"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
