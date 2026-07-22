import { useState } from "react";
import ProductList from "../components/ProductList";

const API = import.meta.env.VITE_API_URL;

function ArtistModal({ product, onClose }) {
  if (!product) return null;
  const credit = product.soldCredit;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(23,1,27,0.9)" }} onClick={onClose}>
      <div className="w-full max-w-md p-8" style={{ fontFamily: "Space Grotesk", background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)" }} onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-start mb-6">
          <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em]" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            ARTISTA
          </div>
          <button onClick={onClose} className="text-xs uppercase tracking-widest transition-colors" style={{ color: "var(--color-text-muted)" }}>
            [CERRAR]
          </button>
        </div>

        <h2 className="text-[28px] font-bold uppercase tracking-tighter leading-none mb-2" style={{ color: "var(--color-text)" }}>
          {product.title}
        </h2>

        {credit ? (
          <div className="space-y-4 mt-6">
            {credit.artist_name && (
              <div className="pl-4" style={{ borderLeft: "2px solid var(--color-accent)" }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>ARTISTA</p>
                <p className="text-sm" style={{ color: "var(--color-text)" }}>{credit.artist_name}</p>
              </div>
            )}
            {credit.artist_bio && (
              <div className="pl-4" style={{ borderLeft: "2px solid var(--color-text-muted)" }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>BIO</p>
                <p className="text-sm" style={{ color: "var(--color-text)" }}>{credit.artist_bio}</p>
              </div>
            )}
            {credit.music_url && (
              <a
                href={credit.music_url}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 text-xs uppercase tracking-widest text-center transition-all mt-4"
                style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-bg-dark)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
              >
                ESCUCHAR_MUSICA
              </a>
            )}
          </div>
        ) : (
          <p className="text-xs uppercase tracking-widest mt-6 pl-4" style={{ color: "var(--color-text-muted)", borderLeft: "2px solid var(--color-text-muted)" }}>
            ARTISTA_PENDIENTE
          </p>
        )}
      </div>
    </div>
  );
}

export default function Sold() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = async (product) => {
    try {
      const res = await fetch(`${API}/products/${product.id_product}/sold-credit`);
      const data = await res.json();
      setSelectedProduct({ ...product, soldCredit: data.data });
    } catch (error) {
      setSelectedProduct({ ...product, soldCredit: null });
    }
  };

  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>
      <div className="mb-10">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          ARCHIVO
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none mb-2" style={{ color: "var(--color-text)" }}>
          OBRAS_VENDIDAS
        </h1>
        <p className="text-xs uppercase tracking-widest pl-4" style={{ color: "var(--color-text-muted)", borderLeft: "2px solid var(--color-accent)" }}>
          ESTAS OBRAS YA TIENEN DUEÑO
        </p>
      </div>

      <ProductList isSold={true} onCardClick={handleCardClick} />
      <ArtistModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}