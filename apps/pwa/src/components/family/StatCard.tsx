"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  /** Cor de destaque do ícone (classe Tailwind de texto). */
  accent?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "text-rose-500",
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div
        className={cn(
          "mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50",
          accent,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold leading-none text-slate-800">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
