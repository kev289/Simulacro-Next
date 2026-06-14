"use client";

import { useEffect, useState } from "react";
import { ProductCard, type Producto } from "@/src/components/ProductCard";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useTraduccion } from "@/src/contexts/I18nProvider";

interface ProductGridProps {
  userId?: string;
  onAddToCart?: (productId: string) => void;
  onRequireAuth?: () => void;
  actualizarEn?: number;
}

export function ProductGrid({
  userId,
  onAddToCart,
  onRequireAuth,
  actualizarEn = 0,
}: ProductGridProps) {
  const { t } = useTraduccion();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sincronizandoFav, setSincronizandoFav] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error(t.errorCarga);
        setProductos(data.products || data);
      } catch {
        setError(t.errorCarga);
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, [t.errorCarga, actualizarEn]);

  useEffect(() => {
    async function cargarFavoritos() {
      if (!userId) {
        setFavoritos(new Set());
        return;
      }
      try {
        const res = await fetch(`/api/favorites?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          const ids = (data.favorites || []).map(
            (fav: { productId: { _id: string } | string }) =>
              typeof fav.productId === "string"
                ? fav.productId
                : fav.productId?._id
          );
          setFavoritos(new Set(ids.filter(Boolean)));
        }
      } catch {
        /* catálogo sigue visible */
      }
    }
    cargarFavoritos();
  }, [userId]);

  const manejarFavorito = async (productoId: string) => {
    if (!userId) {
      onRequireAuth?.();
      return;
    }

    setSincronizandoFav(productoId);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: productoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(t.errorCarga);

      setFavoritos((prev) => {
        const siguiente = new Set(prev);
        if (data.action === "added") siguiente.add(productoId);
        else siguiente.delete(productoId);
        return siguiente;
      });
    } catch {
      setError(t.errorCarga);
    } finally {
      setSincronizandoFav(null);
    }
  };

  const manejarCarrito = (productoId: string) => {
    if (!userId) {
      onRequireAuth?.();
      return;
    }
    onAddToCart?.(productoId);
  };

  if (cargando) return <EstadoCarga mensaje={t.cargando} tipo="sincronizando" />;
  if (error) return <EstadoCarga mensaje={error} tipo="error" />;
  if (productos.length === 0) return <EstadoCarga mensaje={t.sinProductos} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <ProductCard
          key={producto._id}
          producto={producto}
          esFavorito={favoritos.has(producto._id)}
          alAlternarFavorito={manejarFavorito}
          alAnadirCarrito={manejarCarrito}
          deshabilitarFavorito={sincronizandoFav === producto._id}
        />
      ))}
    </div>
  );
}
