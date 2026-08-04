import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudioEditor from "../components/studio/StudioEditor";
import { Link, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Lab() {
  const { user, token } = useContext(AuthContext);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const initialFormat = searchParams.get("format") || "cover";
  const [studioProduct, setStudioProduct] = useState(null);
  const imageId = searchParams.get("image");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/users/studio-access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setAccess(data.data))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!productId) return;
    fetch(`${API}/products/${productId}`)
      .then(r => r.json())
      .then(data => setStudioProduct(data.data?.product || null))
      .catch(() => setStudioProduct(null));
  }, [productId]);

  return (
    <section className="min-h-screen px-6 py-4" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      {/* Header compacto tipo navbar */}
      <div className="flex items-center gap-4 flex-wrap mb-2">
        <Link to="/"
          className="text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent-secondary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}>
          ← Volver
        </Link>
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.3em]" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          LAB
        </div>
        <h1 className="text-lg font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
          INFINITE_STUDIO
        </h1>
      </div>

      {/* Segunda línea: estado de acceso */}
      {loading ? (
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>[VERIFICANDO_ACCESO...]</p>
      ) : (
        <>
          {!user && (
            <div className="flex items-center gap-3 flex-wrap mb-4 text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
              <span>// MODO_INVITADO — creá una cuenta para guardar borradores, comprá una obra para descargar</span>
              <Link to="/account/register"
                className="px-3 py-1 font-bold whitespace-nowrap"
                style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                CREAR_CUENTA
              </Link>
            </div>
          )}

          {user && !access?.hasAccess && (
            <div className="flex items-center gap-3 flex-wrap mb-4 text-xs uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
              <span>// MODO_DEMO — descarga bloqueada, comprá una obra para descargar tu creación</span>
              <Link to="/products"
                className="px-3 py-1 font-bold whitespace-nowrap"
                style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                VER_CATÁLOGO
              </Link>
            </div>
          )}

          {user && access?.hasAccess && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs uppercase tracking-widest" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
              ✓ ACCESO_ACTIVO — EXPIRA {new Date(access.expiresAt).toLocaleDateString("es-AR")}
            </div>
          )}

          <StudioEditor hasAccess={!!access?.hasAccess} canSaveDraft={!!user} token={token} studioProduct={studioProduct} initialFormat={initialFormat} initialImageId={imageId} />
        </>
      )}
    </section>
  );
}