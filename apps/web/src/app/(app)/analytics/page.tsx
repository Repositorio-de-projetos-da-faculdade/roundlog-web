"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/layout/EmptyState";
import { getMyHospital } from "@/lib/api/hospital";
import {
  getComplianceMetrics,
  getHandoffMetrics,
  getWardAnalytics,
} from "@/lib/api/analytics";
import { getNearMissSummary } from "@/lib/api/near-misses";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldAlert } from "lucide-react";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const SEVERITY_LABELS: Record<string, string> = {
  near_miss: "Quase-erro",
  no_harm: "Sem dano",
  harm: "Com dano",
};

const CATEGORY_LABELS: Record<string, string> = {
  medication: "Medicação",
  procedure: "Procedimento",
  communication: "Comunicação",
  equipment: "Equipamento",
  fall: "Queda",
};

function defaultRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 3600 * 1000);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export default function AnalyticsPage() {
  const [fromDate, setFromDate] = useState(defaultRange().from);
  const [toDate, setToDate] = useState(defaultRange().to);

  // Converter datas para ISO datetime nas pontas
  const range = useMemo(
    () => ({
      from: new Date(`${fromDate}T00:00:00.000Z`).toISOString(),
      to: new Date(`${toDate}T23:59:59.999Z`).toISOString(),
    }),
    [fromDate, toDate],
  );

  const hospital = useQuery({ queryKey: ["hospital"], queryFn: getMyHospital });
  const compliance = useQuery({
    queryKey: ["compliance", range],
    queryFn: () => getComplianceMetrics(range),
  });
  const handoffs = useQuery({
    queryKey: ["handoff-metrics", range],
    queryFn: () => getHandoffMetrics(range),
  });
  const nearMiss = useQuery({
    queryKey: ["near-miss-summary"],
    queryFn: getNearMissSummary,
  });

  const wardIds = hospital.data?.wards.map((w) => w.id) ?? [];
  const wardsAnalytics = useQuery({
    queryKey: ["wards-analytics", wardIds],
    queryFn: async () => {
      return Promise.all(
        wardIds.map(async (id) => {
          const a = await getWardAnalytics(id);
          const ward = hospital.data?.wards.find((w) => w.id === id);
          return { ...a, name: ward?.name ?? id };
        }),
      );
    },
    enabled: wardIds.length > 0,
  });

  const complianceData = compliance.data
    ? [
        { name: "Resolvidas", value: compliance.data.resolvedConducts, color: "#10b981" },
        {
          name: "Em aberto",
          value: compliance.data.totalConducts - compliance.data.resolvedConducts,
          color: "#f59e0b",
        },
      ]
    : [];

  const handoffData = handoffs.data
    ? [
        { name: "Com ciência", value: handoffs.data.acknowledgedHandoffs, color: "#3b82f6" },
        {
          name: "Pendentes",
          value: handoffs.data.totalHandoffs - handoffs.data.acknowledgedHandoffs,
          color: "#cbd5e1",
        },
      ]
    : [];

  const occupancyData = wardsAnalytics.data?.map((w) => ({
    name: w.name,
    Ocupados: w.occupiedBeds,
    Livres: w.totalBeds - w.occupiedBeds,
  }));

  return (
    <PageShell
      title="Painel de Gestão"
      description="Indicadores consolidados de qualidade e operação"
      actions={
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label htmlFor="an-from" className="text-xs">
              De
            </Label>
            <Input
              id="an-from"
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="an-to" className="text-xs">
              Até
            </Label>
            <Input
              id="an-to"
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Compliance — condutas resolvidas">
          {compliance.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : compliance.data && compliance.data.totalConducts > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={complianceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    label
                  >
                    {complianceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Taxa: <strong>{compliance.data.complianceRate.toFixed(1)}%</strong>
              </p>
            </>
          ) : (
            <EmptyState
              title="Sem condutas no período"
              description="Ajuste o intervalo de datas para ver dados."
            />
          )}
        </ChartCard>

        <ChartCard title="Plantões com ciência">
          {handoffs.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : handoffs.data && handoffs.data.totalHandoffs > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={handoffData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    label
                  >
                    {handoffData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Taxa: <strong>{handoffs.data.ackRate.toFixed(1)}%</strong>
              </p>
            </>
          ) : (
            <EmptyState
              title="Sem plantões no período"
              description="Nenhuma passagem gerada no intervalo escolhido."
            />
          )}
        </ChartCard>

        <ChartCard title="Ocupação por ala" className="lg:col-span-2">
          {wardsAnalytics.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : occupancyData && occupancyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ocupados" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Livres" stackId="a" fill="#e2e8f0" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Sem alas cadastradas" />
          )}
        </ChartCard>

        <ChartCard title="Quase-erros por severidade">
          {nearMiss.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : nearMiss.data && nearMiss.data.total > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={nearMiss.data.bySeverity.map((s) => ({
                    name: SEVERITY_LABELS[s.severity] ?? s.severity,
                    value: s._count,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {nearMiss.data.bySeverity.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={ShieldAlert} title="Sem quase-erros registrados" />
          )}
        </ChartCard>

        <ChartCard title="Quase-erros por categoria">
          {nearMiss.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : nearMiss.data && nearMiss.data.total > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={nearMiss.data.byCategory.map((c) => ({
                  name: CATEGORY_LABELS[c.category] ?? c.category,
                  Quantidade: c._count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Quantidade" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={ShieldAlert} title="Sem quase-erros registrados" />
          )}
        </ChartCard>
      </div>
    </PageShell>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border bg-card p-6 ${className ?? ""}`}>
      <h2 className="text-sm font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
