"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartDropdown } from "@/src/components/CartDropdown";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";

interface CartItem {
  _id: string;
  productId: { price: number; name: string; image?: string };
  quantity: number;
}

export default function CartPage() {
  const { usuario, cargando: cargandoSesion, error: errorSesion } = useRequireAuth();
  const { t } = useTraduccion();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCarrito = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const res = await fetch(`/api/cart?userId=${usuario.userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(t.errorCarga);
      setItems(data.cart || []);
    } catch {
      setError(t.errorCarga);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) cargarCarrito();
  }, [usuario]);

  const actualizarCantidad = async (cartItemId: string, cantidad: number) => {
    if (cantidad < 1) return;
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: cantidad }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t.errorCarga);
      await cargarCarrito();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorCarga);
    }
  };

  const eliminarItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(t.errorCarga);
      await cargarCarrito();
    } catch {
      setError(t.errorCarga);
    }
  };

  const finalizarCompra = async () => {
    if (!usuario) return;
    setProcesando(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: usuario.userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t.errorCarga);
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorCarga);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BarraNavegacion usuario={usuario} cargando={cargandoSesion} mostrarPanel />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{t.panelCarrito}</h1>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {t.irPanel}
          </Link>
        </div>

        {(error || errorSesion) && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error || errorSesion}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {cargandoSesion || cargando ? (
            <EstadoCarga mensaje={t.sincronizando} tipo="sincronizando" />
          ) : (
            <CartDropdown
              cartItems={items as never}
              onUpdateQuantity={actualizarCantidad}
              onRemoveItem={eliminarItem}
              onCheckout={finalizarCompra}
              procesando={procesando}
            />
          )}
        </div>
      </main>
    </div>
  );
}
