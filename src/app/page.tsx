"use client";

import { useRouter } from "next/navigation";
import { ProductGrid } from "@/src/components/ProductGrid";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useAuth } from "@/src/hooks/useAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { ShoppingBag } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { usuario, cargando, estaAutenticado } = useAuth();
  const { t, idioma } = useTraduccion();

  const requiereSesion = () => router.push(`/${idioma}/login`);

  const manejarCarrito = async (productId: string) => {
    if (!usuario) {
      requiereSesion();
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: usuario.userId, productId, quantity: 1 }),
      });
      if (res.ok) router.push(`/${idioma}/dashboard`);
    } catch {
      /* silencioso */
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <BarraNavegacion
        usuario={usuario}
        cargando={cargando}
        mostrarPanel={estaAutenticado}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag size={24} className="text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t.catalogo}</h1>
            <p className="text-slate-500 mt-0.5 text-sm">
              Explora nuestros productos. Inicia sesión para comprar o guardar favoritos.
            </p>
          </div>
        </div>

        {cargando ? (
          <EstadoCarga mensaje={t.cargando} tipo="sincronizando" />
        ) : (
          <ProductGrid
            userId={usuario?.userId}
            onAddToCart={manejarCarrito}
            onRequireAuth={requiereSesion}
          />
        )}
      </main>
    </div>
  );
}
