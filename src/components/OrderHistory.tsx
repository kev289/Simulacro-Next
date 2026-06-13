"use client";
import { useEffect, useState } from "react";

interface SaleItem {
  _id: string;
  total: number;
  createdAt: string;
  products: Array<{
    productId: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

interface OrderHistoryProps {
  userId: string;
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/sales?userId=${userId}`);
        const data = await res.json();
        setSales(data.sales || data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [userId]);

  if (loading) return <p className="text-[#111111] animate-pulse text-sm font-bold">Cargando historial...</p>;
  if (sales.length === 0) return <p className="text-zinc-500 text-sm">No has realizado ninguna compra todavía.</p>;

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div key={sale._id} className="border border-[#e5e5e5] bg-white p-4 rounded font-mono text-xs">
          <div className="flex justify-between text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 font-bold">
            <span>Pedido #{sale._id.substring(18, 24).toUpperCase()}</span>
            <span>Fecha: {new Date(sale.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-1 mb-3">
            {sale.products.map((p, idx) => (
              <div key={idx} className="flex justify-between text-zinc-600">
                <span>• {p.productId?.name || "Producto Desconocido"} (x{p.quantity})</span>
                <span>${((p.productId?.price || 0) * p.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#e5e5e5]">
            <span className="text-emerald-600 font-bold">Estado: Completado</span>
            <span className="text-sm font-black text-[#111111]">Total: ${sale.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}