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

  if (loading) return <p className="text-emerald-500 animate-pulse text-sm">🔄 DECRYPTING_FAVORITES...</p>;
  if (favorites.length === 0) return <p className="text-zinc-500 text-sm">No tienes productos en favoritos.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((fav) => {
        const product = fav.productId;
        if (!product) return null; 
        
        return (
          <div key={fav._id} className="border border-zinc-800 bg-zinc-950 p-4 rounded flex flex-col justify-between">
            <div>
              <div className="w-full h-32 bg-zinc-900 rounded mb-3 overflow-hidden">
                {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
              </div>
              <h3 className="font-bold text-zinc-100 text-sm mb-1">{product.name}</h3>
              <span className="text-emerald-400 text-xs font-bold">${product.price.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => onRemoveFavorite(fav._id)}
              className="w-full mt-4 py-1.5 border border-zinc-800 hover:border-red-500 bg-zinc-900 text-zinc-400 hover:text-red-400 text-xs rounded transition-all"
            >
              [REMOVE_FAVORITE]
            </button>
          </div>
        );
      })}
    </div>
  );
}