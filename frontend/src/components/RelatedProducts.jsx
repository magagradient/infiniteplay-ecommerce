import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";

const API = import.meta.env.VITE_API_URL;

const MIN_RESULTS = 3;
const CARD_WIDTH = 256; // w-64
const GAP = 24; // gap-6
const UNIT = CARD_WIDTH + GAP;

async function fetchByParam(key, value, excludeId) {
  if (!value) return [];
  try {
    const res = await fetch(`${API}/products?${key}=${encodeURIComponent(value)}&is_sold=false`);
    const data = await res.json();
    const list = data.data || [];
    return list.filter((p) => p.id_product !== excludeId);
  } catch (err) {
    console.error(`Error al buscar relacionados por ${key}:`, err);
    return [];
  }
}

export default function RelatedProducts({ product }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frameWidth, setFrameWidth] = useState("100%");
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);

  // Calcula cuántas cards enteras entran en el ancho disponible,
  // y fija el ancho del marco visible a ese múltiplo exacto (sin sobrante que corte una card)
  const measure = useCallback(() => {
    if (!wrapperRef.current) return;
    const available = wrapperRef.current.clientWidth;
    const count = Math.max(1, Math.floor((available + GAP) / UNIT));
    setFrameWidth(count * UNIT - GAP || available);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!product) return;

    const buildRelated = async () => {
      setLoading(true);
      let results = [];
      const seenIds = new Set();

      const addUnique = (list) => {
        for (const p of list) {
          if (!seenIds.has(p.id_product)) {
            seenIds.add(p.id_product);
            results.push(p);
          }
        }
      };

      if (product.series?.title) {
        const bySeries = await fetchByParam("series", product.series.title, product.id_product);
        addUnique(bySeries);
      }

      if (results.length < MIN_RESULTS && product.keywords?.length) {
        for (const k of product.keywords) {
          if (results.length >= MIN_RESULTS) break;
          const byKeyword = await fetchByParam("keywords", k.name, product.id_product);
          addUnique(byKeyword);
        }
      }

      if (results.length < MIN_RESULTS && product.colors?.length) {
        for (const c of product.colors) {
          if (results.length >= MIN_RESULTS) break;
          const byColor = await fetchByParam("colors", c.name, product.id_product);
          addUnique(byColor);
        }
      }

      setRelated(results.slice(0, 9));
      setLoading(false);
    };

    buildRelated();
  }, [product]);

  const scrollByOne = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -UNIT : UNIT, behavior: "smooth" });
  };

  if (loading) {
    return (
      <p className="text-text-muted text-xs uppercase tracking-widest mt-16">[BUSCANDO_RELACIONADOS...]</p>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-20 max-w-5xl mx-auto" style={{ fontFamily: "Space Grotesk" }} ref={wrapperRef}>
      <div className="flex items-center justify-between gap-3 mb-8 border-l-4 border-accent pl-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tighter text-text-primary">
            TE_PODRÍA_GUSTAR
          </h2>
          <p className="text-accent-secondary text-xs uppercase tracking-widest mt-1">
            // {related.length} OBRA{related.length !== 1 ? "S" : ""} RELACIONADA{related.length !== 1 ? "S" : ""}
          </p>
        </div>

        {related.length > 1 && (
          <div className="flex gap-2 pr-2">
            <button
              onClick={() => scrollByOne("left")}
              aria-label="Anterior"
              className="w-9 h-9 flex items-center justify-center border border-text-muted/30 text-text-muted hover:border-accent-secondary hover:text-accent-secondary transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => scrollByOne("right")}
              aria-label="Siguiente"
              className="w-9 h-9 flex items-center justify-center border border-text-muted/30 text-text-muted hover:border-accent-secondary hover:text-accent-secondary transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ width: frameWidth, overflow: "hidden" }}>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {related.map((p) => (
            <div key={p.id_product} className="flex-shrink-0 w-64 snap-start">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
