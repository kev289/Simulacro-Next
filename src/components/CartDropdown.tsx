"use client";

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
}

export function CartDropdown({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDropdownProps) {
  const total = cartItems.reduce((acc, item) => {
    return acc + (item.productId?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="font-mono">
      {/* Item list */}
      <div className="space-y-0">
        {cartItems.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
              CARRITO VACIO
            </p>
          </div>
        ) : (
          cartItems.map((item, idx) => (
            <div
              key={item._id}
              className={`flex items-center justify-between py-3 ${
                idx < cartItems.length - 1 ? "border-b border-[#e5e5e5]" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-[#f6f6f6] border border-[#e5e5e5] flex items-center justify-center overflow-hidden">
                  {item.productId?.image ? (
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[8px] text-zinc-400">—</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-[#111] truncate uppercase">
                    {item.productId?.name}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#111] text-[11px] font-bold">
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 hover:bg-[#111] hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-2 py-1 border-x border-[#111] text-[#111] text-center">
                    {String(item.quantity).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 hover:bg-[#111] hover:text-white transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item._id)}
                  className="text-[11px] font-bold text-zinc-400 hover:text-[#111] transition-colors px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="border-t-2 border-[#111] mt-4 pt-4 space-y-3">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-zinc-400">TOTAL</span>
            <span className="text-[#111]">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-[#111] border border-[#111] text-white font-bold py-2.5 text-[11px] uppercase tracking-widest transition-all duration-100 hover:bg-white hover:text-[#111] disabled:opacity-30 cursor-pointer"
          >
            FINALIZAR COMPRA
          </button>
        </div>
      )}
    </div>
  );
}