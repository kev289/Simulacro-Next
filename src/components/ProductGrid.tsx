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
    return <p className="text-[#111111] animate-pulse text-sm font-bold">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return <p className="text-zinc-500 text-sm">No se encontraron productos en la base de datos.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="border border-[#e5e5e5] bg-white p-4 rounded flex flex-col justify-between hover:border-[#111111] transition-colors group"
        >
          <div>
            <div className="w-full h-40 bg-[#f6f6f6] rounded mb-4 flex items-center justify-center border border-[#e5e5e5] group-hover:border-[#111111] overflow-hidden text-xs text-zinc-400">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                "Sin imagen"
              )}
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#111111] group-hover:underline transition-all">
                {product.name}
              </h3>
              <span className="text-[#111111] font-black">${product.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-600 line-clamp-2 mb-4">{product.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#e5e5e5]">
            <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
              <span>Stock: {product.stock}</span>
              <span>Ref: {product._id.substring(0, 6)}</span>
            </div>
            
            <button 
              onClick={() => onAddToCart(product._id)}
              disabled={product.stock <= 0}
              className="w-full py-2 bg-[#111111] border border-[#111111] hover:bg-white hover:text-[#111111] text-white rounded text-xs font-bold transition-all disabled:opacity-50 disabled:hover:bg-[#111111] disabled:hover:text-white"
            >
              {product.stock > 0 ? "Agregar al Carrito" : "Agotado"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}