"use client";

import { useRouter } from "next/navigation";
import { ProductGrid } from "@/src/components/ProductGrid";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useAuth } from "@/src/hooks/useAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";

export default function HomePage() {
  const router = useRouter();
  const { usuario, cargando, estaAutenticado } = useAuth();
  const { t } = useTraduccion();

  const requiereSesion = () => router.push("/login");

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
      if (res.ok) router.push("/dashboard");
    } catch {
      /* silencioso */
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraNavegacion
        usuario={usuario}
        cargando={cargando}
        mostrarPanel={estaAutenticado}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{t.catalogo}</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Explora nuestros productos. Inicia sesión para comprar o guardar favoritos.
          </p>
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
