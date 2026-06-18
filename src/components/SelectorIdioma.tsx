"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { Globe } from "lucide-react";

export function SelectorIdioma() {
  const { idioma, cambiarIdioma, idiomasDisponibles } = useTraduccion();
  const pathname = usePathname();
  const router = useRouter();

  const cambiar = (codigo: string) => {
    cambiarIdioma(codigo as "es" | "en" | "pt");
    const rutaSinIdioma = pathname.replace(/^\/(es|en|pt)/, "") || "/";
    router.push(`/${codigo}${rutaSinIdioma}`);
  };

  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
      <Globe size={14} className="text-slate-400 ml-1.5" />
      {idiomasDisponibles.map(({ codigo, etiqueta }) => (
        <button
          key={codigo}
          type="button"
          onClick={() => cambiar(codigo)}
          className={`px-2 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all tracking-wider ${
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
