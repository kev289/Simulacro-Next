"use client";

import { useState } from "react";
import Link from "next/link";
import { FavoritesList } from "@/src/components/FavoritesList";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { Heart, ArrowLeft } from "lucide-react";

export default function FavoritesPage() {
  const { usuario, cargando, error } = useRequireAuth();
  const { t, idioma } = useTraduccion();
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
    <div className="min-h-screen bg-[#f6f6f6]">
      <BarraNavegacion usuario={usuario} cargando={cargando} mostrarPanel />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{t.panelFavoritos}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Productos que te gustan</p>
            </div>
          </div>
          <Link href={`/${idioma}/dashboard`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
            <ArrowLeft size={14} />
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
