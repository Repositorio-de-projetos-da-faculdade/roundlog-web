"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { register, login } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Role } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PHYSICIAN" as Role,
    hospitalId: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      // Register retorna só o User; faz login em seguida para obter token.
      const auth = await login({ email: formData.email, password: formData.password });
      setAuth(auth.user, auth.token);
      router.push("/dashboard");
    } catch {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Cadastre-se para começar a usar o RoundLog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Dr. João Silva"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => setFormData({ ...formData, role: val as Role })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHYSICIAN">Médico(a)</SelectItem>
                <SelectItem value="NURSE">Enfermeiro(a)</SelectItem>
                <SelectItem value="TECHNICIAN">Técnico(a) de Enfermagem</SelectItem>
                <SelectItem value="MANAGER">Gestor(a)</SelectItem>
                <SelectItem value="ADMIN">Administrador(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospitalId">ID do Hospital</Label>
            <Input
              id="hospitalId"
              placeholder="ID do hospital"
              value={formData.hospitalId}
              onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Informado pelo administrador do hospital.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Conta
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
