"use client";

interface CartItem {
  _id: string; // ID del registro en el carrito
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
  onClose: () => void;
}

export function CartDropdown({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  onClose 
}: CartDropdownProps) {

  const total = cartItems.reduce((acc, item) => {
    return acc + (item.productId?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="absolute top-16 right-8 w-80 bg-zinc-950 border border-zinc-800 shadow-2xl rounded p-4 z-50 font-mono">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
        <span className="font-bold text-xs text-emerald-400">tu_carrito.json</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xs">
          [cerrar]
        </button>
      </div>
      
      {/* LISTA DE ITEMS */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {cartItems.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">El carrito está vacío.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-[8px] text-zinc-600 overflow-hidden">
                  {item.productId?.image ? (
                    <img src={item.productId.image} alt={item.productId.name} className="w-full h-full object-cover" />
                  ) : (
                    "[bin]"
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 truncate w-28">{item.productId?.name}</h4>
                  <span className="text-[10px] text-emerald-400">${((item.productId?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              </div>

              {/* CONTROLES DE CANTIDAD */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-zinc-800 rounded bg-zinc-900 text-xs">
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-1.5 py-0.5 hover:text-emerald-400 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-1 text-zinc-300 text-[11px]">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="px-1.5 py-0.5 hover:text-emerald-400"
                  >
                    +
                  </button>
                </div>
                
                {/* BOTÓN ELIMINAR */}
                <button 
                  onClick={() => onRemoveItem(item._id)}
                  className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-zinc-800 mt-4 pt-4 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-400">Total:</span>
          <span className="font-bold text-emerald-400">${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 rounded text-xs transition-colors disabled:opacity-50 disabled:hover:bg-emerald-500"
        >
          EXECUTE_CHECKOUT()
        </button>
      </div>
    </div>
  );
}