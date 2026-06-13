"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdmissions } from "@/lib/api/admissions";
import { getMyHospital } from "@/lib/api/hospital";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, ClipboardList } from "lucide-react";
import type { AdmissionStatus } from "@/lib/types";

const TAKE = 20;

type StatusFilter = AdmissionStatus | "ALL";

export default function AdmissionsPage() {
  const [status, setStatus] = useState<StatusFilter>("ACTIVE");
  const [wardId, setWardId] = useState<string>("");
  const [page, setPage] = useState(0);

  const hospital = useQuery({ queryKey: ["hospital"], queryFn: getMyHospital });

  const { data, isLoading } = useQuery({
    queryKey: ["admissions", status, wardId, page],
    queryFn: () =>
      getAdmissions({
        status: status === "ALL" ? undefined : status,
        wardId: wardId || undefined,
        skip: page * TAKE,
        take: TAKE,
      }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / TAKE)) : 1;

  return (
    <PageShell
      title="Internações"
      description="Pacientes internados no seu hospital"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus((v as StatusFilter) || "ACTIVE");
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Internados (ACTIVE)</SelectItem>
                <SelectItem value="DISCHARGED">Alta dada (DISCHARGED)</SelectItem>
                <SelectItem value="ALL">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Ala</label>
            <Select
              value={wardId || "_all"}
              onValueChange={(v) => {
                setWardId(!v || v === "_all" ? "" : v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-9 w-56">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Todas as alas</SelectItem>
                {hospital.data?.wards.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Leito</TableHead>
                <TableHead>Ala</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24">
                    <EmptyState
                      icon={ClipboardList}
                      title="Nenhuma internação"
                      description="Ajuste os filtros ou abra uma nova internação a partir de um leito disponível."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.patient.name}</TableCell>
                    <TableCell className="font-mono text-xs">{a.patient.cpf}</TableCell>
                    <TableCell>{a.bed.code}</TableCell>
                    <TableCell>{a.bed.ward.name}</TableCell>
                    <TableCell>
                      {new Date(a.admittedAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.status === "ACTIVE" ? "default" : "secondary"}>
                        {a.status === "ACTIVE" ? "Internado" : "Alta dada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/admissions/${a.id}`}
                          aria-label={`Abrir internação de ${a.patient.name}`}
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && data.total > TAKE && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {data.total} internações · página {page + 1} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
