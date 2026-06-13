"use client";
import { useState, useEffect } from "react";
import { ProductGrid } from "@/src/components/ProductGrid";
import { CartDropdown } from "@/src/components/CartDropdown";
import { FavoritesList } from "@/src/components/FavoritesList";
import { OrderHistory } from "@/src/components/OrderHistory";

const MOCK_USER_ID = "645b8e9f1c4b2a3d4e5f6g7h"; 

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<"shop" | "favorites" | "history">("shop");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

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
    setCartItems(prev => prev.map(item => 
      item._id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
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
      setCurrentView("shop");
      setTimeout(() => setCurrentView("favorites"), 10);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const total = cartItems.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: MOCK_USER_ID, total }),
      });

      if (res.ok) {
        setCartItems([]);
        setIsCartOpen(false);
        setCurrentView("history");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative flex h-screen w-full bg-[#f6f6f6] text-[#111111] antialiased font-mono selection:bg-[#111111] selection:text-white">
      
      <aside className="w-64 border-r border-[#e5e5e5] p-6 flex flex-col justify-between bg-white select-none">
        <div>
          <div className="border-b border-[#111111] pb-4 mb-8">
            <h1 className="text-sm font-black tracking-tighter uppercase text-[#111111]">
              Mi Tienda
            </h1>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tight">Panel de Administración</p>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentView("shop")}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border ${currentView === "shop" ? "bg-[#111111] border-[#111111] text-white" : "border-transparent text-zinc-600 hover:bg-[#f6f6f6] hover:text-[#111111]"}`}
            >
              Catálogo
            </button>
            <button 
              onClick={() => setCurrentView("favorites")}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border ${currentView === "favorites" ? "bg-[#111111] border-[#111111] text-white" : "border-transparent text-zinc-600 hover:bg-[#f6f6f6] hover:text-[#111111]"}`}
            >
              Favoritos
            </button>
            <button 
              onClick={() => setCurrentView("history")}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition-all border ${currentView === "history" ? "bg-[#111111] border-[#111111] text-white" : "border-transparent text-zinc-600 hover:bg-[#f6f6f6] hover:text-[#111111]"}`}
            >
              Mis Pedidos
            </button>
          </nav>
        </div>

        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className={`w-full py-2.5 px-3 text-xs font-bold border transition-all duration-150 flex justify-between items-center ${isCartOpen ? "bg-[#111111] text-white border-[#111111]" : "border-[#111111] bg-white hover:bg-[#111111] hover:text-white"}`}
        >
          <span>🛒 Ver Carrito</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold border ${isCartOpen ? "bg-white text-[#111111] border-white" : "bg-[#111111] text-white border-[#111111]"}`}>
            {String(totalItemsInCart).padStart(2, '0')}
          </span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 flex flex-col">
        
        <div className="flex justify-between items-center border-b-2 border-[#111111] pb-4 mb-8">
          <div className="flex space-x-4 items-center">
            <span className="text-xs font-bold tracking-widest uppercase text-[#111111]">
              {currentView === "shop" && "CATÁLOGO DE PRODUCTOS"}
              {currentView === "favorites" && "TUS PRODUCTOS FAVORITOS"}
              {currentView === "history" && "HISTORIAL DE PEDIDOS"}
            </span>
          </div>
          <div className="flex space-x-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>Mostrando Todos</span>
            <span>•</span>
            <span>Ordenar por: Precio</span>
          </div>
        </div>

        <div className="flex-1">
          {currentView === "shop" && <ProductGrid onAddToCart={handleAddToCart} />}
          {currentView === "favorites" && <FavoritesList userId={MOCK_USER_ID} onRemoveFavorite={handleRemoveFavorite} />}
          {currentView === "history" && <OrderHistory userId={MOCK_USER_ID} />}
        </div>
      </main>

      {isCartOpen && (
        <CartDropdown 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onCheckout={handleCheckout}
          onClose={() => setIsCartOpen(false)}
        />
      )}

    </div>
  );
}