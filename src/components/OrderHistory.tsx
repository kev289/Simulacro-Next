"use client";

import { useEffect, useState } from "react";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useTraduccion } from "@/src/contexts/I18nProvider";

interface SaleProduct {
  productName?: string;
  productPrice?: number;
  productId?: string | { name: string; price: number };
  quantity: number;
}

interface SaleItem {
  _id: string;
  total: number;
  createdAt: string;
  products: SaleProduct[];
}

interface OrderHistoryProps {
  userId: string;
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const { t } = useTraduccion();
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSales() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/sales?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(t.errorCarga);
        setSales(data.sales || data);
      } catch {
        setError(t.errorCarga);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [userId, t.errorCarga]);

  if (loading) return <EstadoCarga mensaje={t.sincronizando} tipo="sincronizando" />;
  if (error) return <EstadoCarga mensaje={error} tipo="error" />;
  if (sales.length === 0) return <EstadoCarga mensaje={t.sinVentas} />;

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div key={sale._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-800">
              {t.recibo} #{sale._id.slice(-6).toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(sale.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-1 mb-3">
            {sale.products?.map((p, idx) => {
              const nombre =
                p.productName ??
                (typeof p.productId === "object" ? p.productId?.name : null) ??
                "Producto";
              const precio =
                p.productPrice ??
                (typeof p.productId === "object" ? p.productId?.price : 0) ??
                0;

              return (
                <div key={idx} className="flex justify-between text-sm text-slate-600">
                  <span>
                    {nombre} × {p.quantity}
                  </span>
                  <span>${(precio * p.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <span className="text-xs text-emerald-600 font-medium">{t.estadoCompletado}</span>
            <span className="font-bold text-slate-800">${sale.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
