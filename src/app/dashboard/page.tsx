"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ProductGrid } from "@/src/components/ProductGrid";
import { CartDropdown } from "@/src/components/CartDropdown";
import { FavoritesList } from "@/src/components/FavoritesList";
import { OrderHistory } from "@/src/components/OrderHistory";
import { BarraNavegacion } from "@/src/components/BarraNavegacion";
import { EstadoCarga } from "@/src/components/EstadoCarga";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useTraduccion } from "@/src/contexts/I18nProvider";

type PanelFlotante = "favoritos" | "historial" | "carrito" | null;

interface CartItem {
  _id: string;
  productId: { price: number };
  quantity: number;
}

export default function DashboardPage() {
  const { usuario, cargando: cargandoSesion, error: errorSesion, cerrarSesion } = useRequireAuth();
  const { t } = useTraduccion();
  const [panelActivo, setPanelActivo] = useState<PanelFlotante>(null);
  const [itemsCarrito, setItemsCarrito] = useState<CartItem[]>([]);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);
  const [procesandoCompra, setProcesandoCompra] = useState(false);
  const [errorOperacion, setErrorOperacion] = useState<string | null>(null);
  const [actualizarCatalogo, setActualizarCatalogo] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panel: PanelFlotante) => {
    setPanelActivo((prev) => (prev === panel ? null : panel));
  };

  const fetchCart = async () => {
    if (!usuario) return;
    setCargandoCarrito(true);
    setErrorOperacion(null);
    try {
      const res = await fetch(`/api/cart?userId=${usuario.userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(t.errorCarga);
      setItemsCarrito(data.cart || []);
    } catch {
      setErrorOperacion(t.errorCarga);
    } finally {
      setCargandoCarrito(false);
    }
  };

  useEffect(() => {
    if (usuario) fetchCart();
  }, [usuario]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const navbar = document.getElementById("dashboard-acciones");
        if (navbar && navbar.contains(e.target as Node)) return;
        setPanelActivo(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!usuario) return;
    setErrorOperacion(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: usuario.userId, productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error(t.errorCarga);
      await fetchCart();
    } catch {
      setErrorOperacion(t.errorCarga);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setErrorOperacion(null);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t.errorCarga);
      await fetchCart();
    } catch (err) {
      setErrorOperacion(err instanceof Error ? err.message : t.errorCarga);
    }
  };

  const handleRemoveCartItem = async (cartItemId: string) => {
    setErrorOperacion(null);
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(t.errorCarga);
      await fetchCart();
    } catch {
      setErrorOperacion(t.errorCarga);
    }
  };

  const handleRemoveFavorite = async (favId: string) => {
    if (!usuario) return;
    setErrorOperacion(null);
    try {
      const res = await fetch(`/api/favorites?favId=${favId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(t.errorCarga);
      setPanelActivo(null);
      setTimeout(() => setPanelActivo("favoritos"), 10);
    } catch {
      setErrorOperacion(t.errorCarga);
    }
  };

  const handleCheckout = async () => {
    if (!usuario) return;
    setProcesandoCompra(true);
    setErrorOperacion(null);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: usuario.userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || t.errorCarga);
      }
      setItemsCarrito([]);
      setErrorOperacion(null);
      setPanelActivo("historial");
      setActualizarCatalogo((n) => n + 1);
      await fetchCart();
    } catch (err) {
      setErrorOperacion(err instanceof Error ? err.message : t.errorCarga);
    } finally {
      setProcesandoCompra(false);
    }
  };

  const totalItemsInCart = itemsCarrito.reduce((acc, item) => acc + item.quantity, 0);

  const btnPanel = (panel: PanelFlotante, etiqueta: string, icono: string) => (
    <button
      type="button"
      onClick={() => togglePanel(panel)}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
        panelActivo === panel
          ? "bg-indigo-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icono} {etiqueta}
      {panel === "carrito" && totalItemsInCart > 0 && (
        <span className="ml-1 text-xs bg-white/20 px-1.5 rounded-full">
          {totalItemsInCart}
        </span>
      )}
    </button>
  );

  if (cargandoSesion || !usuario) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EstadoCarga mensaje={t.cargando} tipo="sincronizando" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50">
      <BarraNavegacion
        usuario={usuario}
        alCerrarSesion={cerrarSesion}
        acciones={
          <nav id="dashboard-acciones" className="hidden sm:flex items-center gap-1">
            {btnPanel(null, t.catalogo, "📦")}
            {btnPanel("favoritos", t.favoritos, "🤍")}
            {btnPanel("historial", t.historial, "📋")}
            {btnPanel("carrito", t.carrito, "🛒")}
          </nav>
        }
      />

      {(errorOperacion || errorSesion) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {errorOperacion || errorSesion}
          </div>
        </div>
      )}

      {panelActivo && (
        <div
          ref={panelRef}
          className={`absolute z-40 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden ${
            panelActivo === "carrito"
              ? "right-4 sm:right-6 top-20 w-80 max-h-[75vh]"
              : panelActivo === "favoritos"
              ? "right-4 sm:right-6 top-20 w-[calc(100%-2rem)] sm:w-full max-w-2xl max-h-[75vh]"
              : "right-4 sm:right-6 top-20 w-[calc(100%-2rem)] sm:w-full max-w-xl max-h-[75vh]"
          }`}
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex justify-between items-center">
            <span className="font-semibold text-slate-800">
              {panelActivo === "carrito" && t.panelCarrito}
              {panelActivo === "favoritos" && t.panelFavoritos}
              {panelActivo === "historial" && t.panelHistorial}
            </span>
            <button
              type="button"
              onClick={() => setPanelActivo(null)}
              className="text-sm text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {t.cerrar}
            </button>
          </div>

          <div className="p-5 overflow-y-auto max-h-[calc(75vh-4rem)]">
            {panelActivo === "carrito" &&
              (cargandoCarrito ? (
                <EstadoCarga mensaje={t.sincronizando} tipo="sincronizando" />
              ) : (
                <CartDropdown
                  cartItems={itemsCarrito as never}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveCartItem}
                  onCheckout={handleCheckout}
                  procesando={procesandoCompra}
                />
              ))}
            {panelActivo === "favoritos" && usuario && (
              <FavoritesList userId={usuario.userId} onRemoveFavorite={handleRemoveFavorite} />
            )}
            {panelActivo === "historial" && usuario && (
              <OrderHistory userId={usuario.userId} />
            )}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t.catalogo}</h1>
            <p className="text-sm text-slate-500 mt-1">Tu espacio personal de compras</p>
          </div>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {t.volverCatalogo}
          </Link>
        </div>

        <ProductGrid
          userId={usuario.userId}
          onAddToCart={handleAddToCart}
          actualizarEn={actualizarCatalogo}
        />
      </main>

      {/* Barra inferior móvil */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-50">
        {btnPanel(null, "", "📦")}
        {btnPanel("favoritos", "", "🤍")}
        {btnPanel("historial", "", "📋")}
        {btnPanel("carrito", "", "🛒")}
      </nav>
    </div>
  );
}
