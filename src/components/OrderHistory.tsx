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

  if (loading) {
    return (
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold animate-pulse py-6 text-center">
        ESPERANDO RESPUESTA
      </p>
    );
  }

  if (sales.length === 0) {
    return (
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold py-6 text-center">
        TRANSACCIONES NO ENCONTRADAS
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {sales.map((sale, idx) => (
        <div
          key={sale._id}
          className={`py-4 font-mono text-[11px] ${
            idx < sales.length - 1 ? "border-b border-[#e5e5e5]" : ""
          }`}
        >
          {/* Header row */}
          <div className="flex justify-between text-[#111] font-black uppercase tracking-widest mb-3">
            <span>RECEIPT #{sale._id.substring(18, 24).toUpperCase()}</span>
            <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Line items */}
          <div className="space-y-1 mb-3">
            {sale.products.map((p, pidx) => (
              <div key={pidx} className="flex justify-between text-zinc-500">
                <span>
                  — {p.productId?.name || "UNKNOWN_ITEM"} ×{String(p.quantity).padStart(2, "0")}
                </span>
                <span>${((p.productId?.price || 0) * p.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t border-[#e5e5e5]">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              ESTADO: COMPLETADO
            </span>
            <span className="text-[13px] font-black text-[#111]">
              ${sale.total.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}