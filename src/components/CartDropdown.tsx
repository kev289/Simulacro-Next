"use client";

import { useTraduccion } from "@/src/contexts/I18nProvider";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface CartDropdownProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
  procesando?: boolean;
}

export function CartDropdown({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  procesando = false,
}: CartDropdownProps) {
  const { t } = useTraduccion();

  const total = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag size={40} className="mx-auto text-slate-300 mb-4" />
        <p className="text-sm text-slate-500">{t.carritoVacio}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
              {item.productId?.image ? (
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">—</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-800 truncate">
                {item.productId?.name}
              </h4>
              <span className="text-sm font-semibold text-indigo-600">
                ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg text-sm">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-2.5 py-1.5 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded-l-lg text-slate-600"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 py-1.5 border-x border-slate-200 min-w-[2rem] text-center font-medium text-slate-700 text-sm">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                  className="px-2.5 py-1.5 hover:bg-slate-100 cursor-pointer rounded-r-lg text-slate-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item._id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-200 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">{t.total}</span>
          <span className="text-slate-800 text-xl font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={procesando}
          className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {procesando ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingBag size={16} />
          )}
          {procesando ? t.sincronizando : t.finalizarCompra}
        </button>
      </div>
    </div>
  );
}
