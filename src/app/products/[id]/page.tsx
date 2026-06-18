"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useAuth } from "@/src/hooks/useAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import type { Producto } from "@/src/components/ProductCard";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useAuth();
  const { t, idioma } = useTraduccion();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProducto() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(t.productoNoEncontrado);
        setProducto(data.getProductById || data.product);
      } catch {
        setError(t.productoNoEncontrado);
      } finally {
        setCargando(false);
      }
    }
    if (id) cargarProducto();
  }, [id, t.productoNoEncontrado]);

  const anadirAlCarrito = async () => {
    if (!usuario) {
      router.push(`/${idioma}/login`);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: usuario.userId, productId: id, quantity: 1 }),
      });
      if (res.ok) router.push(`/${idioma}/dashboard`);
    } catch {
      setError(t.errorCarga);
    }
  };

  const precio = producto && typeof producto.price === "number" ? producto.price : 0;

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <BarraNavegacion usuario={usuario} cargando={cargandoSesion} mostrarPanel={!!usuario} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {cargando && <EstadoCarga mensaje={t.cargando} tipo="sincronizando" />}
        {error && <EstadoCarga mensaje={error} tipo="error" />}

        {producto && (
          <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="aspect-video bg-slate-100">
              {producto.image ? (
                <img src={producto.image} alt={producto.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Package size={48} />
                </div>
              )}
            </div>

            <div className="p-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{producto.name}</h1>
              <p className="text-3xl font-bold text-indigo-600 mb-6">${precio.toFixed(2)}</p>

              <section className="mb-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">{t.descripcion}</h2>
                <p className="text-slate-600 leading-relaxed">{producto.description}</p>
              </section>

              {producto.specifications && (
                <section className="mb-6">
                  <h2 className="text-sm font-semibold text-slate-700 mb-2">{t.especificaciones}</h2>
                  <p className="text-slate-600 leading-relaxed">{producto.specifications}</p>
                </section>
              )}

              <p className="text-sm text-slate-500 mb-8">
                {t.stock}: {producto.stock}
              </p>

              <div className="flex gap-3">
                <Link
                  href={`/${idioma}`}
                  className="flex-1 py-3 text-center text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={15} />
                  {t.volverCatalogo}
                </Link>
                <button
                  type="button"
                  onClick={anadirAlCarrito}
                  disabled={producto.stock <= 0}
                  className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  {producto.stock > 0 ? t.anadirCarrito : t.sinStock}
                </button>
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
