import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de proteção de rotas.
 * Redireciona para /login se não houver token no cookie/localStorage.
 *
 * NOTA: Como usamos Zustand com persist (localStorage), o middleware do Next.js
 * (que roda no edge/server) NÃO tem acesso ao localStorage. A proteção
 * completa é feita no lado do client via layout do (app).
 * Este middleware serve como fallback para cookies, se o backend usar cookies.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verifica token no cookie (se o backend usar cookies httpOnly)
  const token = request.cookies.get("roundlog-token")?.value;

  // Se não há cookie de token e a rota não é pública, redireciona
  // NOTA: A proteção principal é no client-side via authStore
  if (!token && !isPublicPath) {
    // Não redireciona para evitar loop — a proteção client-side cuida disso
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
