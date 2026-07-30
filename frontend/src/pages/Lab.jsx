import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import StudioEditor from "../components/studio/StudioEditor";

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
      ) : (
        <div>
          {!user && (
            <div className="max-w-md border p-6 mb-8" style={{ borderColor: "var(--color-text-muted)" }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>
          // MODO_INVITADO
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                Podés probar el editor libremente. Creá una cuenta para guardar borradores, y comprá una obra para descargar tu creación.
              </p>
              <Link to="/account/register"
                className="inline-block px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                CREAR_CUENTA
              </Link>
            </div>
          )}

          {user && !access?.hasAccess && (
            <div className="max-w-md border p-6 mb-8" style={{ borderColor: "var(--color-accent)", background: "var(--color-bg-light)" }}>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
          // MODO_DEMO — DESCARGA BLOQUEADA
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                Podés guardar borradores. Para descargar tu creación, comprá una obra.
              </p>
              <Link to="/products"
                className="inline-block px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                VER_CATÁLOGO
              </Link>
            </div>
          )}

          {user && access?.hasAccess && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs uppercase tracking-widest" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
              ✓ ACCESO_ACTIVO — EXPIRA {new Date(access.expiresAt).toLocaleDateString("es-AR")}
            </div>
          )}

          <StudioEditor hasAccess={!!access?.hasAccess} canSaveDraft={!!user} token={token} />
        </div>
      )}
    </section>
  );
}