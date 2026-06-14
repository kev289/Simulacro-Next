"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

const rutasProtegidas = ["/dashboard", "/favorites", "/cart"];

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  useEffect(() => {
    const protegida = rutasProtegidas.some(
      (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`)
    );

    if (!protegida || auth.cargando || auth.usuario) return;

    const destino = `/login?redirect=${encodeURIComponent(pathname)}`;
    router.replace(destino);
  }, [auth.cargando, auth.usuario, pathname, router]);

  return auth;
}
