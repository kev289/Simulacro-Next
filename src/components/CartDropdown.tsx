"use client";

import { useTraduccion } from "@/src/contexts/I18nProvider";

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
      <div className="py-10 text-center text-sm text-slate-500">{t.carritoVacio}</div>
    );
  }

  return (
    <div className="space-y-3">
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
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
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-slate-800 truncate">
                {item.productId?.name}
              </h4>
              <span className="text-sm text-indigo-600 font-semibold">
                ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg text-sm">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2.5 py-1 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded-l-lg"
              >
                −
              </button>
              <span className="px-2.5 py-1 border-x border-slate-200 min-w-2rem text-center">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="px-2.5 py-1 hover:bg-slate-100 cursor-pointer rounded-r-lg"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemoveItem(item._id)}
              className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-500">{t.total}</span>
          <span className="text-slate-800 text-lg font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={procesando}
          className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {procesando ? t.sincronizando : t.finalizarCompra}
        </button>
      </div>
    </div>
  );
}
