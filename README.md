# RoundLog — Guia de Arquitetura Frontend

> Documento de referência para os devs de frontend (P3 e P4). Leia antes de escrever qualquer linha de código.

---

## Stack Obrigatória

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14 (App Router) | Framework principal — web e PWA |
| TypeScript | 5.x | Obrigatório em todos os arquivos |
| Tailwind CSS | v3 | Estilização — sem CSS puro |
| shadcn/ui | latest | Componentes base |
| React Query (TanStack) | v5 | Fetch, cache e sincronização de dados |
| Zustand | v4 | Estado global (auth, hospital config) |
| Recharts | v2 | Gráficos no painel de gestão |
| next-pwa | latest | PWA para app mobile da enfermagem |

---

## Estrutura de Pastas

```
apps/
  web/                        ← App principal (médico, enfermagem, gestão)
    app/
      (auth)/
        login/
          page.tsx
      (app)/
        layout.tsx            ← Layout autenticado (sidebar + header)
        dashboard/
          page.tsx
        visits/
          [id]/
            page.tsx          ← Detalhe de visita com cards estruturados
        wards/
          [id]/
            page.tsx          ← Dashboard de ala (enfermagem)
        handoffs/
          page.tsx            ← Passagem de plantão
        patients/
          [id]/
            page.tsx
        analytics/
          page.tsx            ← Painel de gestão
        near-misses/
          page.tsx
    components/
      ui/                     ← Componentes shadcn (não editar)
      layout/
        Sidebar.tsx
        Header.tsx
        PageShell.tsx         ← Wrapper padrão de página com title + breadcrumb
      visits/
        AudioRecorder.tsx     ← Gravação de áudio (MediaRecorder API)
        ConductCard.tsx       ← Card de conduta com ações
        PendingCard.tsx
        AlertCard.tsx
        VisitSummary.tsx      ← Resumo estruturado da visita
      nursing/
        BedCard.tsx           ← Card de leito no dashboard de ala
        WardDashboard.tsx
        ExecutionModal.tsx    ← Modal de confirmação de execução
      handoffs/
        HandoffReport.tsx
        HandoffAck.tsx
    lib/
      api/
        client.ts             ← Instância do fetch com interceptors (token)
        visits.ts             ← Funções de API para visitas
        patients.ts
        wards.ts
        handoffs.ts
        analytics.ts
      hooks/
        useVisit.ts           ← useQuery para visita individual
        useWardDashboard.ts   ← useQuery com polling (30s) para ala
        useAudioRecorder.ts   ← Hook de gravação de áudio
        useCurrentUser.ts
      stores/
        authStore.ts          ← Zustand: user, token, hospital
        uiStore.ts            ← Zustand: sidebar aberta, tema
      types/
        visit.types.ts
        patient.types.ts
        ward.types.ts
        user.types.ts
    middleware.ts             ← Proteção de rotas (redireciona se não autenticado)

  pwa/                        ← App mobile beira-leito (enfermagem + familiar)
    app/
      (auth)/login/page.tsx
      (app)/
        beds/
          [id]/page.tsx       ← Visão de leito individual mobile
        record/
          page.tsx            ← Tela de gravação de visita (médico mobile)
        family/
          patient/[token]/
            page.tsx          ← App do familiar (acesso por token)
    components/
      mobile/
        BedMobileCard.tsx
        AudioRecorderMobile.tsx
        FamilyUpdateCard.tsx
```

---

## Padrões Obrigatórios

### 1. Nunca use `fetch` diretamente nos componentes

Toda comunicação com a API passa por `lib/api/`:

```typescript
// lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getTokenFromStore(); // Zustand
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// lib/api/visits.ts
export const getVisit = (id: string) =>
  apiFetch<Visit>(`/visits/${id}`);

export const createVisit = (admissionId: string) =>
  apiFetch<Visit>(`/visits`, { method: "POST", body: JSON.stringify({ admissionId }) });

export const uploadAudio = async (visitId: string, blob: Blob) => {
  const form = new FormData();
  form.append("audio", blob, "visit.webm");
  return apiFetch<{ status: string }>(`/visits/${visitId}/audio`, {
    method: "POST",
    body: form,
    headers: {},  // sem Content-Type: deixa o browser setar o boundary
  });
};
```

### 2. Dados do servidor sempre via React Query

```typescript
// hooks/useVisit.ts
import { useQuery } from "@tanstack/react-query";
import { getVisit } from "@/lib/api/visits";

export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: () => getVisit(id),
    refetchInterval: (data) =>
      data?.status === "processing" ? 3000 : false, // polling enquanto IA processa
  });
}
```

### 3. Tipagem completa — sem `any`

```typescript
// types/visit.types.ts
export type VisitStatus = "recording" | "processing" | "ready" | "error";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Conduct {
  id: string;
  description: string;
  priority: Priority;
  deadline: string | null;
  status: "open" | "in_progress" | "resolved";
  resolvedBy: string | null;
  resolvedAt: string | null;
}

export interface Visit {
  id: string;
  admissionId: string;
  status: VisitStatus;
  transcriptRaw: string | null;
  structuredJson: VisitStructuredData | null;
  startedAt: string;
  finishedAt: string | null;
  conducts: Conduct[];
  pendings: Pending[];
  alerts: ClinicalAlert[];
  prescriptions: Prescription[];
}
```

### 4. Componentes pequenos e focados

Cada componente faz uma coisa. Exemplo correto:

```tsx
// components/visits/ConductCard.tsx
interface ConductCardProps {
  conduct: Conduct;
  onResolve: (id: string, notes: string) => void;
}

export function ConductCard({ conduct, onResolve }: ConductCardProps) {
  const priorityColor = {
    critical: "bg-red-500",
    high: "bg-orange-400",
    medium: "bg-yellow-400",
    low: "bg-blue-400",
  }[conduct.priority];

  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${priorityColor}`} />
        <span className="text-sm font-medium">{conduct.description}</span>
      </div>
      {conduct.status === "open" && (
        <button
          onClick={() => onResolve(conduct.id, "")}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Marcar como executado →
        </button>
      )}
    </div>
  );
}
```

### 5. Gravação de áudio (componente crítico)

```typescript
// hooks/useAudioRecorder.ts
export function useAudioRecorder() {
  const [state, setState] = useState<"idle" | "recording" | "stopped">("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = () => {
      setBlob(new Blob(chunks.current, { type: "audio/webm" }));
      chunks.current = [];
    };
    recorder.start();
    mediaRecorder.current = recorder;
    setState("recording");
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setState("stopped");
  };

  return { state, blob, start, stop };
}
```

---

## Fluxo de Dados: Visita Médica

```
Médico inicia visita
        ↓
[POST /visits] → cria visit com status "recording"
        ↓
AudioRecorder grava (30–120s)
        ↓
[POST /visits/:id/audio] → envia blob
        ↓
Backend processa (Gemini) — status muda para "processing"
        ↓
Frontend faz polling a cada 3s (React Query refetchInterval)
        ↓
Status muda para "ready"
        ↓
useVisit retorna dados estruturados (conducts, pendings, alerts)
        ↓
VisitSummary renderiza os cards
```

---

## Dashboard de Ala — Tempo Real

O dashboard da enfermagem precisa de dados frescos. Use polling:

```typescript
// hooks/useWardDashboard.ts
export function useWardDashboard(wardId: string) {
  return useQuery({
    queryKey: ["ward-dashboard", wardId],
    queryFn: () => apiFetch<WardDashboard>(`/wards/${wardId}/dashboard`),
    refetchInterval: 30_000, // atualiza a cada 30 segundos
    staleTime: 20_000,
  });
}
```

---

## PWA — Configuração Obrigatória

O app mobile precisa funcionar com tela bloqueada e notificações push:

```javascript
// next.config.js (pwa app)
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({ /* nextjs config */ });
```

Permissões necessárias declaradas no `manifest.json`:
- `microphone` — para gravação de áudio
- `notifications` — para alertas de conduta não executada

---

## Variáveis de Ambiente

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=RoundLog
```

---

## Regras de Ouro

1. **Nenhum dado hardcoded** — tudo vem da API
2. **Nenhum `useEffect` para fetch** — use React Query
3. **Nenhum `any`** — tipagem sempre
4. **Componentes de UI não fazem fetch** — recebem dados por props
5. **Nomes em inglês** para arquivos, funções e variáveis — comentários em português se necessário
6. **Commits pequenos e descritivos**: `feat(visits): add audio recorder component`
7. **Toda ação assíncrona tem estado de loading e tratamento de erro visível na UI**

---

## Ordem de Desenvolvimento (Semanas 1 e 2)

**Semana 1 — Base:**
- [ ] Setup Next.js + Tailwind + shadcn + React Query
- [ ] Layout autenticado (sidebar, header)
- [ ] Telas de login e registro
- [ ] Hook `useAudioRecorder` funcional
- [ ] Componente `AudioRecorder` com UI

**Semana 2 — MVP:**
- [ ] Tela de visita médica (gravar + ver resultado)
- [ ] `ConductCard`, `PendingCard`, `AlertCard`
- [ ] Dashboard de ala (enfermagem)
- [ ] `BedCard` com status e condutas do turno
- [ ] `ExecutionModal` para marcar execução
- [ ] Tela de passagem de plantão
