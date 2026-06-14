"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UsuarioSesion {
  userId: string;
  name: string;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarSesion = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
      setError("Error al verificar la sesión");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const cerrarSesion = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsuario(null);
    router.push("/login");
  };

  const requiereSesion = (mensaje?: string) => {
    if (!usuario) {
      router.push("/login");
      return false;
    }
    if (mensaje) setError(mensaje);
    return true;
  };

  return {
    usuario,
    cargando,
    error,
    setError,
    cargarSesion,
    cerrarSesion,
    requiereSesion,
    estaAutenticado: !!usuario,
  };
}
