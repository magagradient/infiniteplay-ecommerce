import { useNavigate } from "react-router-dom";

export default function CheckoutFailure() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>
      <div className="w-full max-w-md p-8 text-center" style={{ border: "1px solid var(--color-accent)" }}>
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          ERROR_DE_PAGO
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none mb-4" style={{ color: "var(--color-text)" }}>
          PAGO_RECHAZADO
        </h1>
        <p className="text-xs uppercase tracking-widest mb-8" style={{ color: "var(--color-text-muted)" }}>
          Hubo un problema con tu pago. Podés intentarlo de nuevo.
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="w-full py-4 font-bold uppercase tracking-widest transition-all"
          style={{ background: "var(--color-accent)", color: "var(--color-text)", border: "1px solid var(--color-accent)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-text)"; }}
        >
          VOLVER_AL_CARRITO
        </button>
      </div>
    </section>
  );
}