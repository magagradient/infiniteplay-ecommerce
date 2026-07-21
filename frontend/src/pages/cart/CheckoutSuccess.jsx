import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>
      <div className="w-full max-w-md p-8 text-center" style={{ border: "1px solid var(--color-accent-secondary)" }}>
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent-secondary)", color: "var(--color-bg-dark)" }}>
          PAGO_EXITOSO
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none mb-4" style={{ color: "var(--color-text)" }}>
          GRACIAS_POR_TU_COMPRA
        </h1>
        <p className="text-xs uppercase tracking-widest mb-8" style={{ color: "var(--color-text-muted)" }}>
          Tu orden fue procesada correctamente. Recibirás tu archivo por email.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 font-bold uppercase tracking-widest transition-all"
          style={{ background: "var(--color-accent-secondary)", color: "var(--color-bg-dark)", border: "1px solid var(--color-accent-secondary)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-bg-dark)"; }}
        >
          VOLVER_AL_INICIO
        </button>
      </div>
    </section>
  );
}