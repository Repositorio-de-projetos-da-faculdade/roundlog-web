"use client";

import type { FamilyUpdate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Heart } from "lucide-react";

interface FamilyUpdateCardProps {
  update: FamilyUpdate;
}

export function FamilyUpdateCard({ update }: FamilyUpdateCardProps) {
  return (
    <Card className="border-none bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Atualização</CardTitle>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {new Date(update.generatedAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm leading-relaxed text-foreground/80 italic whitespace-pre-line">
          {update.contentLay}
        </p>
        <div className="flex items-center justify-between mt-4 border-t pt-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-tight">
            <Heart className="h-3 w-3 text-red-400" />
            Equipe assistencial
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
