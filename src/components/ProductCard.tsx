"use client";

import Link from "next/link";
import { useTraduccion } from "@/src/contexts/I18nProvider";
import { Heart, ShoppingCart, Eye } from "lucide-react";

export interface Producto {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  specifications?: string;
}

interface ProductCardProps {
  producto: Producto;
  esFavorito?: boolean;
  alAlternarFavorito?: (productoId: string) => void;
  alAnadirCarrito?: (productoId: string) => void;
  mostrarDetalle?: boolean;
  deshabilitarFavorito?: boolean;
}

export function ProductCard({
  producto,
  esFavorito = false,
  alAlternarFavorito,
  alAnadirCarrito,
  mostrarDetalle = true,
  deshabilitarFavorito = false,
}: ProductCardProps) {
  const { t, idioma } = useTraduccion();
  const precio = typeof producto.price === "number" ? producto.price : 0;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-slate-100">
        {producto.image ? (
          <img
            src={producto.image}
            alt={producto.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            {t.sinImagen}
          </div>
        )}

        {alAlternarFavorito && (
          <button
            type="button"
            onClick={() => alAlternarFavorito(producto._id)}
            disabled={deshabilitarFavorito}
            aria-label={t.favoritos}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
          >
            <Heart
              size={18}
              className={esFavorito ? "fill-red-500 text-red-500" : "text-slate-400"}
            />
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 leading-snug">{producto.name}</h3>
          <span className="font-bold text-indigo-600 whitespace-nowrap">
            ${precio.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {producto.description}
        </p>

        <p className="text-xs text-slate-400 mb-4">
          {t.stock}: {producto.stock}
        </p>

        <div className="flex flex-col gap-2">
          {mostrarDetalle && (
            <Link
              href={`/${idioma}/products/${producto._id}`}
              className="w-full py-2.5 text-center text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={15} />
              {t.verDetalle}
            </Link>
          )}

          {alAnadirCarrito && (
            <button
              type="button"
              onClick={() => alAnadirCarrito(producto._id)}
              disabled={producto.stock <= 0}
              className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingCart size={15} />
              {producto.stock > 0 ? t.anadirCarrito : t.sinStock}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
