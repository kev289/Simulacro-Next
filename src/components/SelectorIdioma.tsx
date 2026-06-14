"use client";

import { useTraduccion } from "@/src/contexts/I18nProvider";

export function SelectorIdioma() {
  const { idioma, cambiarIdioma, idiomasDisponibles } = useTraduccion();

  return (
    <div className="flex bg-slate-100 rounded-lg p-0.5">
      {idiomasDisponibles.map(({ codigo, etiqueta }) => (
        <button
          key={codigo}
          type="button"
          onClick={() => cambiarIdioma(codigo)}
          className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-all ${
            idioma === codigo
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  );
}
