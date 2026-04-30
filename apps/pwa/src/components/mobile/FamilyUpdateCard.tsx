"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Check } from "lucide-react";

interface FamilyUpdate {
  id: string;
  updateText: string;
  timestamp: string;
  author: string;
  status: "stable" | "improving" | "critical";
}

interface FamilyUpdateCardProps {
  update: FamilyUpdate;
}

export function FamilyUpdateCard({ update }: FamilyUpdateCardProps) {
  const statusColors = {
    stable: "bg-blue-100 text-blue-700",
    improving: "bg-green-100 text-green-700",
    critical: "bg-red-100 text-red-700",
  };

  return (
    <Card className="border-none bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Atualização Médica</CardTitle>
        </div>
        <Badge variant="secondary" className={statusColors[update.status]}>
          {update.status === "stable" ? "Estável" : update.status === "improving" ? "Melhorando" : "Crítico"}
        </Badge>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm leading-relaxed text-foreground/80 italic">
          "{update.updateText}"
        </p>
        <div className="flex items-center justify-between mt-4 border-t pt-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-tight">
            <Heart className="h-3 w-3 text-red-400" />
            {update.author}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {new Date(update.timestamp).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
