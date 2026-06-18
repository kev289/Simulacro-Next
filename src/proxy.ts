import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const idiomas = ["es", "en", "pt"];
const defecto = "es";
const rutasProtegidas = ["/dashboard", "/favorites", "/cart"];

function esRutaProtegida(pathname: string) {
  return rutasProtegidas.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Saltar API, assets, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Si ya fue procesado por una reescritura, dejar pasar
  if (request.headers.get("x-lang-processed") === "1") {
    return NextResponse.next();
  }

  // Detectar idioma en la URL
  const match = pathname.match(/^\/(es|en|pt)(\/|$)/);

  if (match) {
    const lang = match[1];
    const resto = "/" + (pathname.replace(/^\/(es|en|pt)\/?/, "") || "");

    const url = new URL(resto, request.url);
    url.search = search;

    const res = NextResponse.rewrite(url);
    res.headers.set("x-lang-processed", "1");
    res.cookies.set("lang", lang, { path: "/", sameSite: "strict" });

    // Proteger rutas autenticadas
    if (esRutaProtegida(resto)) {
      const accessToken = request.cookies.get("accessToken")?.value;
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (!accessToken && !refreshToken) {
        const loginUrl = new URL(`/${lang}/login`, request.url);
        loginUrl.searchParams.set("redirect", `/${lang}${resto}`);
        return NextResponse.redirect(loginUrl);
      }
    }

    return res;
  }

  // Sin prefijo de idioma → redirigir al idioma por defecto
  const destino = new URL(`/${defecto}${pathname === "/" ? "" : pathname}${search}`, request.url);
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: [
    "/((?!api/|_next/|favicon.ico).*)",
  ],
};
