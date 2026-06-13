"use client";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductGridProps {
  onAddToCart: (productId: string) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 animate-pulse">
          CARGANDO DATOS
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          DATOS NO ENCONTRADOS
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[#e5e5e5]">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white p-5 flex flex-col justify-between group"
        >
          {/* Image */}
          <div>
            <div className="w-full h-44 bg-[#f6f6f6] border border-[#e5e5e5] mb-4 flex items-center justify-center overflow-hidden group-hover:border-[#111] transition-colors">
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

            {/* Info */}
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-black text-[#111] uppercase tracking-tight leading-tight">
                {product.name}
              </h3>
              <span className="text-sm font-black text-[#111] ml-3 whitespace-nowrap">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#e5e5e5]">
            <div className="flex justify-between text-[10px] text-zinc-400 mb-3 font-bold uppercase tracking-widest">
              <span>STOCK: {String(product.stock).padStart(3, "0")}</span>
              <span>REF: {product._id.substring(0, 8)}</span>
            </div>

            <button
              onClick={() => onAddToCart(product._id)}
              disabled={product.stock <= 0}
              className="w-full py-2.5 bg-[#111] border border-[#111] text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-100 hover:bg-white hover:text-[#111] disabled:opacity-30 disabled:hover:bg-[#111] disabled:hover:text-white cursor-pointer"
            >
              {product.stock > 0 ? "AÑADIR AL CARRITO" : "SIN STOCK"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}