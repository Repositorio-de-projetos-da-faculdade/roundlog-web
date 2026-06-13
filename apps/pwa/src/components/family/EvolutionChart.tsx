"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import type { FamilyTimelinePoint } from "@/lib/api/family";

interface EvolutionChartProps {
  timeline: FamilyTimelinePoint[];
}

function shortDay(iso: string): string {
  // iso = "YYYY-MM-DD" -> "DD/MM"
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function EvolutionChart({ timeline }: EvolutionChartProps) {
  const data = timeline.map((p) => ({
    label: shortDay(p.date),
    Visitas: p.visits,
    Atualizações: p.updates,
  }));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
          <Activity className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Acompanhamento dos últimos dias
          </h2>
          <p className="text-[11px] text-slate-400">
            Visitas médicas e atualizações por dia
          </p>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gVisitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gUpdates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ color: "#64748b", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="Visitas"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#gVisitas)"
            />
            <Area
              type="monotone"
              dataKey="Atualizações"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#gUpdates)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> Visitas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> Atualizações
        </span>
      </div>
    </div>
  );
}
