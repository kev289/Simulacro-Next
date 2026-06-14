"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoritesList } from "@/src/components/FavoritesList";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";

export default function FavoritesPage() {
  const { usuario, cargando, error } = useRequireAuth();
  const { t } = useTraduccion();
  const [claveLista, setClaveLista] = useState(0);

  const eliminarFavorito = async (favId: string) => {
    try {
      const res = await fetch(`/api/favorites?favId=${favId}`, { method: "DELETE" });
      if (res.ok) setClaveLista((k) => k + 1);
    } catch {
      /* silencioso */
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraNavegacion usuario={usuario} cargando={cargando} mostrarPanel />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{t.panelFavoritos}</h1>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {t.irPanel}
          </Link>
        </div>

        {cargando && <EstadoCarga mensaje={t.cargando} tipo="sincronizando" />}
        {error && <EstadoCarga mensaje={error} tipo="error" />}
        {usuario && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <FavoritesList
              key={claveLista}
              userId={usuario.userId}
              onRemoveFavorite={eliminarFavorito}
            />
          </div>
        )}
      </main>
    </div>
  );
}
