import ProductList from "../../components/ProductList";

export default function Shop() {
  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div
          className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4"
          style={{ background: "var(--color-accent)", color: "var(--color-bg-dark)" }}
        >
          CATÁLOGO
        </div>
        <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
          TODAS_LAS_OBRAS
        </h1>
      </div>

      <ProductList />

    </section>
  );
}