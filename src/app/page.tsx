import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-zinc-100 font-mono p-4 selection:bg-emerald-500 selection:text-black">
      
      {/* CASCARÓN CENTRAL */}
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-8 rounded shadow-2xl text-center space-y-8">
        
        {/* LOGO / TÍTULO */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-widest text-emerald-500">
            CORE_STORE //
          </h1>
          <p className="text-xs text-zinc-500">
            [ status: active_and_ready ]
          </p>
        </div>

        {/* DESCRIPCIÓN CORTA */}
        <p className="text-sm text-zinc-400 leading-relaxed">
          Plataforma de e-commerce de alto rendimiento. Autentícate para acceder al panel de control y gestionar tus compras.
        </p>

        {/* BOTONES DE ACCESO */}
        <div className="flex flex-col space-y-3 pt-4">
          <Link 
            href="/api/auth/login" 
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded transition-colors"
          >
            EXECUTE_LOGIN()
          </Link>
          
          <Link 
            href="/api/auth/register" 
            className="w-full py-3 px-4 border border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300 text-sm rounded transition-colors hover:text-white"
          >
            INITIALIZE_REGISTER()
          </Link>
        </div>

        {/* FOOTER ACCESORIO */}
        <div className="text-[10px] text-zinc-600 pt-4 border-t border-zinc-900">
          MEDELLIN_CO_2026 // AUTODIDACT_MODE
        </div>
      </div>

    </main>
  );
}