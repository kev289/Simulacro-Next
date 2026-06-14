"use client";

interface EstadoCargaProps {
  mensaje: string;
  tipo?: "carga" | "error" | "sincronizando";
}

export function EstadoCarga({ mensaje, tipo = "carga" }: EstadoCargaProps) {
  return (
    <div className="py-16 text-center">
      {tipo === "sincronizando" && (
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
      )}
      {tipo === "error" && (
        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-lg">
          !
        </div>
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
