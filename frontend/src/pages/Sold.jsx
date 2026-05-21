import ProductList from "../components/ProductList";

export default function Sold() {
  return (
    <section className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
          ARCHIVO
        </div>
        <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none mb-2">
          OBRAS_VENDIDAS
        </h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest border-l border-[#ffb4ab] pl-4">
          // ESTAS OBRAS YA TIENEN DUEÑO
        </p>
      </div>

      <ProductList isSold={true} />

    </section>
  );
}