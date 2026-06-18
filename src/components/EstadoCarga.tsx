"use client";

import { Loader2, AlertCircle, Package } from "lucide-react";

interface EstadoCargaProps {
  mensaje: string;
  tipo?: "carga" | "error" | "sincronizando";
}

export function EstadoCarga({ mensaje, tipo = "carga" }: EstadoCargaProps) {
  return (
    <div className="py-16 text-center">
      {tipo === "sincronizando" && (
        <Loader2 size={28} className="animate-spin mx-auto mb-4 text-indigo-500" />
      )}
      {tipo === "error" && (
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
      )}
      {tipo === "carga" && (
        <Package size={28} className="mx-auto mb-4 text-slate-300" />
      )}
      <p
        className={`text-sm ${
          tipo === "error"
            ? "text-red-600 font-medium"
            : "text-slate-500"
        }`}
      >
        {mensaje}
      </p>
    </div>
  );
}
