"use client";

import { useEffect, useState } from "react";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useTraduccion } from "@/src/contexts/I18nProvider";

interface ProductoFavorito {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface FavoriteItem {
  _id: string;
  productId: ProductoFavorito | null;
}

interface FavoritesListProps {
  userId: string;
  onRemoveFavorite: (favId: string) => void;
}

export function FavoritesList({ userId, onRemoveFavorite }: FavoritesListProps) {
  const { t } = useTraduccion();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/favorites?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(t.errorCarga);
        setFavorites(data.favorites || []);
      } catch {
        setError(t.errorCarga);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [userId, t.errorCarga]);

  if (loading) return <EstadoCarga mensaje={t.sincronizando} tipo="sincronizando" />;
  if (error) return <EstadoCarga mensaje={error} tipo="error" />;
  if (favorites.length === 0) return <EstadoCarga mensaje={t.sinFavoritos} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((fav) => {
        const product = fav.productId;
        if (!product) return null;
        const precio = typeof product.price === "number" ? product.price : 0;

        return (
          <div
            key={fav._id}
            className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  —
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-800 truncate">{product.name}</h3>
              <p className="text-sm font-semibold text-indigo-600 mt-1">
                ${precio.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => onRemoveFavorite(fav._id)}
                className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
              >
                {t.eliminar}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
