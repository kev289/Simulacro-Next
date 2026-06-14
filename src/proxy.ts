import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rutasProtegidas = ["/dashboard", "/favorites", "/cart"];

function esRutaProtegida(pathname: string) {
  return rutasProtegidas.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!esRutaProtegida(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/favorites", "/favorites/:path*", "/cart", "/cart/:path*"],
};
