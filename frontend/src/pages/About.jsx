export default function About() {
  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      <div className="max-w-2xl">

        <div className="mb-10">
          <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            ABOUT
          </div>
          <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
            SOBRE_MÍ
          </h1>
        </div>

        <div className="space-y-6 pl-8" style={{ borderLeft: "2px solid var(--color-text-muted)" }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            // BIO — próximamente
          </p>
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            [CONTENIDO_EN_CONSTRUCCIÓN]
          </p>
        </div>

      </div>

    </section>
  );
}