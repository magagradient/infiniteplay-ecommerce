import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products?limit=6");
        const data = await res.json();
        if (res.ok) setProducts(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error al traer productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col justify-center px-16 overflow-hidden border-b"
        style={{ borderColor: "var(--color-text-muted)" }}
      >

        {/* Fondo con imagen */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(to right, var(--color-bg-dark), rgba(23,1,27,0.5), transparent)" }}
          ></div>
          <img
            src="/esfera1.jpeg"
            alt="Infinite Play hero"
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-screen"
          />
        </div>

        {/* Contenido */}
        <div className="relative z-20 max-w-4xl">
          <div
            className="inline-block px-2 py-1 mb-4 uppercase tracking-[0.5em] text-xs font-semibold"
            style={{ background: "var(--color-text-muted)", color: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}
          >
            SYSTEM_INITIALIZED
          </div>

          <h1
            className="text-[64px] leading-none tracking-tighter font-bold mb-4"
            style={{ color: "var(--color-text)", fontFamily: "Space Grotesk" }}
          >
            INFINITE_PLAY //<br />
            <span style={{ color: "var(--color-accent)" }} className="italic">VISUAL_TRANSMISSION</span>
          </h1>

          <p
            className="text-lg max-w-xl mb-8"
            style={{ color: "var(--color-text-muted)", fontFamily: "Inter" }}
          >
            ARTE DIGITAL EXPERIMENTAL. ALGORÍTMICAMENTE GENERADO. MANUALMENTE CURADO.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              className="px-8 py-4 font-bold border transition-all flex items-center gap-2"
              style={{
                background: "var(--color-text-muted)",
                color: "var(--color-accent)",
                borderColor: "var(--color-text)",
                boxShadow: "4px 4px 0px var(--color-accent-secondary)",
                fontFamily: "Space Grotesk",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-text)"; e.currentTarget.style.color = "var(--color-accent)"; }}
            >
              EXPLORAR_ARCHIVO
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              className="px-8 py-4 border font-bold transition-all"
              style={{ borderColor: "var(--color-text)", color: "var(--color-text)", fontFamily: "Space Grotesk" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-text)"; e.currentTarget.style.color = "var(--color-bg-dark)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text)"; }}
            >
              VER_OBRAS
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-16 flex items-center gap-4 text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--color-text-muted)", fontFamily: "Space Grotesk" }}
        >
          <div className="w-16 h-[1px]" style={{ background: "var(--color-accent-secondary)" }}></div>
          SCROLL_FOR_DATA
        </div>

      </section>

      {/* Product Gallery Section */}
      <section className="py-8 px-16" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-end mb-8 border-l-4 pl-4"
          style={{ borderColor: "var(--color-accent)" }}
        >
          <div>
            <h2 className="text-[40px] font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
              CURRENT_RELEASES
            </h2>
            <p className="text-xs uppercase mt-1" style={{ color: "var(--color-text-muted)" }}>
              BATCH_ID: 0x992_44 // FILTERED_BY: RECENT
            </p>
          </div>
          <div className="hidden md:flex gap-6 text-xs uppercase mt-4 md:mt-0" style={{ color: "var(--color-text-muted)" }}>
            <span
              className="underline decoration-2 underline-offset-8 cursor-pointer"
              style={{ color: "var(--color-accent)" }}
            >
              ALL
            </span>
            <span className="cursor-pointer hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>TECHNO</span>
            <span className="cursor-pointer hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>AMBIENT</span>
            <span className="cursor-pointer hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>GLITCH</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>[LOADING_DATA...]</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.id_product} product={product} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="mt-8 flex justify-center">
          <button
            className="px-8 py-4 border-2 font-bold transition-all uppercase tracking-widest flex items-center gap-4"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", fontFamily: "Space Grotesk" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-bg-dark)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent)"; }}
          >
            CARGAR_MÁS_OBRAS
            <span className="material-symbols-outlined">sync</span>
          </button>
        </div>

      </section>

      {/* Technical Specs Section */}
      <section
        className="py-8 px-16 border-t"
        style={{ background: "var(--color-bg-light)", borderColor: "var(--color-text-muted)", fontFamily: "Space Grotesk" }}
      >
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="border-l pl-4 space-y-2" style={{ borderColor: "var(--color-accent)" }}>
            <h4 className="font-bold text-xl uppercase" style={{ color: "var(--color-accent)" }}>ALTA_RESOLUCIÓN</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>CADA OBRA ES GENERADA A MÁXIMA RESOLUCIÓN. LISTA PARA IMPRESIÓN, PANTALLA O DISTRIBUCIÓN DIGITAL SIN PÉRDIDA DE CALIDAD.</p>
          </div>

          <div className="border-l pl-4 space-y-2" style={{ borderColor: "var(--color-accent-secondary)" }}>
            <h4 className="font-bold text-xl uppercase" style={{ color: "var(--color-accent-secondary)" }}>OBRA_ÚNICA</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>CADA PIEZA ES IRREPETIBLE. UNA VEZ VENDIDA, SE MARCA COMO AGOTADA Y PASA AL ARCHIVO HISTÓRICO DE INFINITE_PLAY.</p>
          </div>

          <div className="border-l pl-4 space-y-2" style={{ borderColor: "var(--color-accent)" }}>
            <h4 className="font-bold text-xl uppercase" style={{ color: "var(--color-accent)" }}>ENTREGA_DIGITAL</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>TRAS LA COMPRA, RECIBÍS EL ARCHIVO DE FORMA INMEDIATA. DESCARGA SEGURA Y DIRECTA DESDE EL PANEL DE TU CUENTA.</p>
          </div>

        </div>
      </section>

    </main>
  );
}