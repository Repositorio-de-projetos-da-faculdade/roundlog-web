"use client";

import { useQuery } from "@tanstack/react-query";
import { getWards } from "@/lib/api/wards";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BedDouble, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function WardsPage() {
  const { data: wards, isLoading } = useQuery({
    queryKey: ["wards"],
    queryFn: getWards,
  });

  return (
    <PageShell
      title="Alas Hospitalares"
      description="Selecione uma ala para visualizar o dashboard beira-leito"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))
        ) : (
          wards?.map((ward) => (
            <Card key={ward.id} className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{ward.name}</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ward.activeBeds}/{ward.totalBeds}</div>
                <p className="text-xs text-muted-foreground">Leitos ocupados</p>
                <CardDescription className="mt-2">{ward.floor}º Andar</CardDescription>
                <Button className="w-full mt-4 gap-2" variant="outline" asChild>
                  <Link href={`/wards/${ward.id}`}>
                    Ver Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageShell>
  );
}
