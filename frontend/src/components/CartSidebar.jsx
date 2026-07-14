import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cart, loading, isOpen, toggleCart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    toggleCart();
    navigate("/cart/checkout");
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full z-[60] flex flex-col p-8 bg-bg-light text-accent border-l border-accent shadow-[0_0_15px_rgba(232,0,77,0.4)] w-80 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ fontFamily: "Space Grotesk" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-accent pb-1">
        <div>
          <h2 className="text-text-primary font-bold text-xl">SUBSURFACE_CART</h2>
          <p className="text-accent-secondary opacity-90 text-xs">[SYSTEM_READY]</p>
        </div>
        <button onClick={toggleCart} className="text-text-muted hover:text-accent transition-all material-symbols-outlined">
          close
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {loading && <p className="text-text-muted text-xs">Cargando...</p>}

        {!loading && cart.length === 0 && (
          <p className="text-text-muted text-xs">[CARRITO_VACÍO]</p>
        )}

        {!loading && cart.map((item) => (
          <div
            key={item.id_item}
            className="flex justify-between items-center p-1 border border-text-muted/20 hover:border-accent transition-all group"
          >
            <span className="material-symbols-outlined">album</span>
            <span className="flex-1 ml-1 text-text-primary text-xs uppercase">
              {item.product?.title}
            </span>
            <span className="text-text-muted text-xs mr-2">
              ${item.product?.price}
            </span>
            <span
              className="material-symbols-outlined group-hover:text-accent cursor-pointer"
              onClick={() => removeFromCart(item.id_item)}
            >
              delete_forever
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 space-y-4">
        <button onClick={goToCheckout} className="w-full bg-accent text-text-primary font-bold py-4 uppercase tracking-widest hover:shadow-[0_0_20px_#e8004d] transition-all">
          EXECUTE_PURCHASE
        </button>
        <button onClick={goToCheckout} className="w-full text-text-muted hover:text-text-primary flex items-center justify-center gap-1">
          <span className="material-symbols-outlined">payments</span> CHECKOUT
        </button>
        <button onClick={clearCart} className="w-full text-text-muted hover:text-text-primary flex items-center justify-center gap-1">
          <span className="material-symbols-outlined">delete_forever</span> CLEAR
        </button>
      </div>
    </aside>
  );
}