import ProductList from "../../components/ProductList";

export default function Shop() {
  return (
    <section className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
          CATÁLOGO
        </div>
        <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none">
          TODAS_LAS_OBRAS
        </h1>
      </div>

      <ProductList />

    </section>
  );
}