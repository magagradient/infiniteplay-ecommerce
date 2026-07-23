import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Lab() {
  const { user, token } = useContext(AuthContext);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/users/studio-access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setAccess(data.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          LAB
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none mb-2" style={{ color: "var(--color-text)" }}>
          INFINITE_STUDIO
        </h1>
        <p className="text-xs uppercase tracking-widest pl-4" style={{ color: "var(--color-text-muted)", borderLeft: "2px solid var(--color-accent-secondary)" }}>
          // EDITOR GENERATIVO PARA TUS OBRAS
        </p>
      </div>

      {loading ? (
        <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>[VERIFICANDO_ACCESO...]</p>
      ) : !user ? (
        <div className="max-w-md border p-8" style={{ borderColor: "var(--color-text-muted)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>
            // NECESITÁS INICIAR SESIÓN PARA ACCEDER AL STUDIO
          </p>
          <Link to="/account/login"
            className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest transition-all"
            style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            INICIAR_SESIÓN
          </Link>
        </div>
      ) : !access?.hasAccess ? (
        <div className="max-w-md border p-8" style={{ borderColor: "var(--color-text-muted)" }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>
            // ACCESO_BLOQUEADO
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--color-text)" }}>
            El studio está disponible durante 15 días después de cada compra. Comprá una obra para activar tu acceso.
          </p>
          <Link to="/products"
            className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest transition-all"
            style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            VER_CATÁLOGO
          </Link>
        </div>
      ) : (
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs uppercase tracking-widest" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
            ✓ ACCESO_ACTIVO — EXPIRA {new Date(access.expiresAt).toLocaleDateString("es-AR")}
          </div>
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            [EDITOR_EN_CONSTRUCCIÓN — PRÓXIMAMENTE]
          </p>
        </div>
      )}

    </section>
  );
}