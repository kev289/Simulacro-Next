"use client";
import { useState } from "react";
// Aquí iremos importando los componentes a medida que los creemos
// import { Sidebar } from "@/src/components/Sidebar";
// import { ProductGrid } from "@/src/components/ProductGrid";
// import { FavoritesList } from "@/src/components/FavoritesList";
// import { OrderHistory } from "@/src/components/OrderHistory";
// import { CartDropdown } from "@/src/components/CartDropdown";

export default function DashboardPage() {
  // Controla qué se ve en el área central
  const [currentView, setCurrentView] = useState<"shop" | "favorites" | "history">("shop");
  
  // Controla el cuadradito flotante del carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-black text-zinc-100 antialiased font-mono selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR / NAVBAR IZQUIERDO */}
      {/* <Sidebar currentView={currentView} setCurrentView={setCurrentView} setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} /> */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col justify-between bg-zinc-950">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-emerald-500 mb-8 font-mono">
            CORE_STORE
          </h1>
          <nav className="space-y-2">
            <button 
              onClick={() => setCurrentView("shop")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${currentView === "shop" ? "bg-zinc-800 text-emerald-400 font-bold border-l-2 border-emerald-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
            >
              [//] Tienda
            </button>
            <button 
              onClick={() => setCurrentView("favorites")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${currentView === "favorites" ? "bg-zinc-800 text-emerald-400 font-bold border-l-2 border-emerald-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
            >
              [*] Favoritos
            </button>
            <button 
              onClick={() => setCurrentView("history")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${currentView === "history" ? "bg-zinc-800 text-emerald-400 font-bold border-l-2 border-emerald-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
            >
              [$] Mis Compras
            </button>
          </nav>
        </div>

        {/* BOTÓN DEL CARRITO EN EL SIDEBAR */}
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className={`w-full py-3 px-4 rounded border transition-all duration-200 flex justify-between items-center ${isCartOpen ? "bg-emerald-500 text-black border-emerald-500 font-bold" : "border-zinc-800 bg-zinc-900 hover:border-emerald-500 text-zinc-200"}`}
        >
          <span>🛒 Carrito</span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${isCartOpen ? "bg-black text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
            0
          </span>
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 overflow-y-auto p-8 bg-zinc-900/40">
        {currentView === "shop" && (
          <div>
            <h2 className="text-2xl font-bold border-b border-zinc-800 pb-4 mb-6">__catálogo_productos</h2>
            {/* <ProductGrid /> */}
            <p className="text-zinc-500 text-sm">Aquí se renderizará la grilla de productos...</p>
          </div>
        )}

        {currentView === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold border-b border-zinc-800 pb-4 mb-6">__mis_favoritos</h2>
            {/* <FavoritesList /> */}
            <p className="text-zinc-500 text-sm">Aquí se renderizarán tus productos guardados...</p>
          </div>
        )}

        {currentView === "history" && (
          <div>
            <h2 className="text-2xl font-bold border-b border-zinc-800 pb-4 mb-6">__historial_compras</h2>
            {/* <OrderHistory /> */}
            <p className="text-zinc-500 text-sm">Aquí aparecerán tus facturas guardadas...</p>
          </div>
        )}
      </main>

      {/* CUADRADITO FLOTANTE DEL CARRITO (DROPDOWN / POPUP) */}
      {isCartOpen && (
        <div className="absolute top-16 right-8 w-80 bg-zinc-950 border border-zinc-800 shadow-2xl rounded p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
            <span className="font-bold text-sm text-emerald-400">tu_carrito.json</span>
            <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-xs">
              [cerrar]
            </button>
          </div>
          
          {/* Contenedor de items */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            <p className="text-xs text-zinc-500 text-center py-4">El carrito está vacío.</p>
          </div>

          {/* Footer del carrito */}
          <div className="border-t border-zinc-800 mt-4 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total:</span>
              <span className="font-bold text-emerald-400">$0.00</span>
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded text-xs transition-colors">
              EXECUTE_CHECKOUT()
            </button>
          </div>
        </div>
      )}

    </div>
  );
}