"use client";
import { useEffect, useState } from "react";

interface FavoriteItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
}

interface FavoritesListProps {
  userId: string;
  onRemoveFavorite: (favId: string) => void;
}

export function FavoritesList({ userId, onRemoveFavorite }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/favorites?userId=${userId}`);
        const data = await res.json();
        setFavorites(data.favorites || data);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [userId]);

  if (loading) {
    return (
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold animate-pulse py-6 text-center">
        DECRYPTING_FAVORITES...
      </p>
    );
  }

  if (favorites.length === 0) {
    return (
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold py-6 text-center">
        ITEMS NO GUARDADOS
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#e5e5e5]">
      {favorites.map((fav) => {
        const product = fav.productId;
        if (!product) return null;

        return (
          <div key={fav._id} className="bg-white p-4 flex flex-col justify-between">
            <div>
              <div className="w-full h-28 bg-[#f6f6f6] border border-[#e5e5e5] mb-3 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    SIN IMAGEN
                  </span>
                )}
              </div>
              <h3 className="text-[12px] font-black text-[#111] uppercase tracking-tight mb-1">
                {product.name}
              </h3>
              <span className="text-[11px] font-bold text-zinc-500">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => onRemoveFavorite(fav._id)}
              className="w-full mt-4 py-2 border border-[#111] bg-white text-[#111] text-[10px] font-bold uppercase tracking-widest transition-all duration-100 hover:bg-[#111] hover:text-white cursor-pointer"
            >
              ELIMINAR
            </button>
          </div>
        );
      })}
    </div>
  );
}