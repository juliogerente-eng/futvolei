import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  "/dashboard",
  "/perfil",
  "/ranking",
  "/campeonatos",
  "/organizar",
  "/admin",
];

// Rotas que requerem role específica
const ROLE_ROUTES: Record<string, string[]> = {
  organizer: ["/organizar"],
  admin: ["/admin"],
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Verificar se é rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está logado e tenta acessar login/cadastro, redireciona para dashboard
  if (user && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verificar roles para rotas específicas
  if (user && isProtectedRoute) {
    // Buscar role do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData) {
      const userRole = userData.role;

      // Verificar se precisa de role específica
      for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
        const needsRole = routes.some((route) => pathname.startsWith(route));

        if (needsRole && userRole !== role && userRole !== "admin") {
          // Admin pode acessar tudo
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes handled separately
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
