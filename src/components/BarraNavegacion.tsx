"use client";

import Link from "next/link";
import { SelectorIdioma } from "@/src/components/SelectorIdioma";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import type { UsuarioSesion } from "@/src/hooks/useAuth";

interface BarraNavegacionProps {
  usuario?: UsuarioSesion | null;
  cargando?: boolean;
  mostrarPanel?: boolean;
  alCerrarSesion?: () => void;
  acciones?: React.ReactNode;
}

export function BarraNavegacion({
  usuario,
  cargando,
  mostrarPanel = false,
  alCerrarSesion,
  acciones,
}: BarraNavegacionProps) {
  const { t } = useTraduccion();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            T
          </span>
          <span className="font-semibold text-slate-800 hidden sm:block">{t.marca}</span>
        </Link>

        <div className="flex items-center gap-3">
          <SelectorIdioma />

          {acciones}

          {cargando ? (
            <span className="text-sm text-slate-400">{t.cargando}</span>
          ) : usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 hidden md:block">
                {t.hola}, <strong className="text-slate-700">{usuario.name}</strong>
              </span>
              {mostrarPanel && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t.irPanel}
                </Link>
              )}
              {alCerrarSesion && (
                <button
                  type="button"
                  onClick={alCerrarSesion}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t.cerrarSesion}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.iniciarSesion}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t.registrarse}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
