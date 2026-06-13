"use client";
import { useState, useEffect, useRef } from "react";
import { ProductGrid } from "@/src/components/ProductGrid";
import { CartDropdown } from "@/src/components/CartDropdown";
import { FavoritesList } from "@/src/components/FavoritesList";
import { OrderHistory } from "@/src/components/OrderHistory";

const MOCK_USER_ID = "645b8e9f1c4b2a3d4e5f6g7h";

type FloatingPanel = "favorites" | "history" | "cart" | null;

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<FloatingPanel>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panel: FloatingPanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  /* ── Cart API ── */
  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      setCartItems(data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ── Click outside to close panel ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const navbar = document.getElementById("dashboard-navbar");
        if (navbar && navbar.contains(e.target as Node)) return;
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: MOCK_USER_ID, productId, quantity: 1 }),
      });
      if (res.ok) await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, { method: "DELETE" });
      if (res.ok) await fetchCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleRemoveFavorite = async (favId: string) => {
    try {
      await fetch(`/api/favorites?favId=${favId}`, { method: "DELETE" });
      /* Force re-mount to refresh data */
      setActivePanel(null);
      setTimeout(() => setActivePanel("favorites"), 10);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const total = cartItems.reduce(
        (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
        0
      );
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: MOCK_USER_ID, total }),
      });

      if (res.ok) {
        setCartItems([]);
        setActivePanel("history");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  /* ── Navbar button helper ── */
  const navBtnClass = (panel: FloatingPanel) =>
    `px-4 py-2 text-[11px] font-bold uppercase tracking-wider border border-[#111] transition-all duration-100 select-none cursor-pointer ${
      activePanel === panel
        ? "bg-[#111] text-white"
        : "bg-white text-[#111] hover:bg-[#111] hover:text-white"
    }`;

  return (
    <div className="relative min-h-screen w-full bg-[#f6f6f6] text-[#111] antialiased font-mono selection:bg-[#111] selection:text-white">

      {/* ═══════════ STICKY TOP NAVBAR ═══════════ */}
      <header
        id="dashboard-navbar"
        className="sticky top-0 z-50 w-full bg-white border-b-2 border-[#111] select-none"
      >
        <div className="max-w-1400px mx-auto px-6 h-14 flex items-center justify-between">
          {/* Left: Brand */}
          <h1 className="text-[11px] font-black tracking-widest uppercase text-[#111]">
            DASHBOARD
          </h1>

          {/* Right: Nav buttons */}
          <nav className="flex items-center gap-1px">
            <button onClick={() => togglePanel("favorites")} className={navBtnClass("favorites")}>
              FAVORITOS
            </button>
            <button onClick={() => togglePanel("history")} className={navBtnClass("history")}>
              HISTORIAL DE TRANSACCIONES
            </button>
            <button onClick={() => togglePanel("cart")} className={navBtnClass("cart")}>
              CARRITO ({String(totalItemsInCart).padStart(2, "0")})
            </button>
          </nav>
        </div>
      </header>

      {/* ═══════════ FLOATING PANELS ═══════════ */}
      {activePanel && (
        <div
          ref={panelRef}
          className={`absolute z-40 bg-white border-2 border-[#111] overflow-y-auto ${
            activePanel === "cart"
              ? "right-6 top-58px w-80 max-h-[80vh]"
              : activePanel === "favorites"
              ? "right-6 top-58px w-full max-w-2xl max-h-[80vh]"
              : "right-6 top-58px w-full max-w-xl max-h-[80vh]"
          }`}
        >
          {/* Panel header */}
          <div className="sticky top-0 bg-white border-b-2 border-[#111] px-5 py-3 flex justify-between items-center z-10">
            <span className="text-[11px] font-black uppercase tracking-widest">
              {activePanel === "cart" && "CARRITO"}
              {activePanel === "favorites" && "ITEMS FAVORITOS"}
              {activePanel === "history" && "HISTORIAL DE TRANSACCIONES"}
            </span>
            <button
              onClick={() => setActivePanel(null)}
              className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[#111] transition-colors cursor-pointer"
            >
              CERRAR
            </button>
          </div>

          {/* Panel body */}
          <div className="p-5">
            {activePanel === "cart" && (
              <CartDropdown
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveCartItem}
                onCheckout={handleCheckout}
              />
            )}
            {activePanel === "favorites" && (
              <FavoritesList userId={MOCK_USER_ID} onRemoveFavorite={handleRemoveFavorite} />
            )}
            {activePanel === "history" && <OrderHistory userId={MOCK_USER_ID} />}
          </div>
        </div>
      )}

      {/* ═══════════ PERMANENT CATALOGUE BACKGROUND ═══════════ */}
      <main className="max-w-1400px mx-auto px-6 py-8">
        <div className="flex justify-between items-center border-b-2 border-[#111] pb-4 mb-8">
          <span className="text-[11px] font-black tracking-widest uppercase">
            CATALOGO
          </span>
        </div>

        <ProductGrid onAddToCart={handleAddToCart} />
      </main>
    </div>
  );
}