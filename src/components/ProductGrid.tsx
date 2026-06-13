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
    return <p className="text-emerald-500 animate-pulse text-sm">LOAD_DATA_STREAM...</p>;
  }

  if (products.length === 0) {
    return <p className="text-zinc-500 text-sm">No se encontraron productos en la base de datos.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product._id} 
          className="border border-zinc-800 bg-zinc-950 p-4 rounded flex flex-col justify-between hover:border-zinc-700 transition-colors group"
        >
          <div>
            <div className="w-full h-40 bg-zinc-900 rounded mb-4 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-700 overflow-hidden text-xs text-zinc-600">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                "[no_image_binary]"
              )}
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h3>
              <span className="text-emerald-400 font-bold">${product.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{product.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <div className="flex justify-between text-[10px] text-zinc-500 mb-2">
              <span>STOCK: {product.stock}</span>
              <span>ID: {product._id.substring(0, 6)}...</span>
            </div>
            
            <button 
              onClick={() => onAddToCart(product._id)}
              disabled={product.stock <= 0}
              className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-emerald-500 hover:bg-emerald-500 hover:text-black text-zinc-300 rounded text-xs font-bold transition-all disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-300 disabled:hover:border-zinc-800"
            >
              {product.stock > 0 ? "ADD_TO_CART()" : "OUT_OF_STOCK"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}