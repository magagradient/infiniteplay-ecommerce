import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--color-bg-light)",
    border: "1px solid var(--color-text-muted)",
    color: "var(--color-text)",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section className="min-h-screen px-16 py-12 flex justify-center" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>
      <div className="max-w-xl w-full">

        <div className="mb-10">
          <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            CONTACTO
          </div>
          <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none mb-2" style={{ color: "var(--color-text)" }}>
            ESCRIBIME
          </h1>
          <p className="text-xs uppercase tracking-widest pl-4" style={{ color: "var(--color-text-muted)", borderLeft: "2px solid var(--color-accent)" }}>
            // ¿TENÉS UNA PROPUESTA O QUERÉS COLABORAR?
          </p>
        </div>

        {sent ? (
          <div className="px-6 py-4 text-xs uppercase tracking-widest" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
            [STATUS: 200] // MENSAJE_ENVIADO — TE RESPONDO A LA BREVEDAD
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: "var(--color-text-muted)" }}>NOMBRE</label>
              <input
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: "var(--color-text-muted)" }}>EMAIL</label>
              <input
                name="email"
                type="email"
                placeholder="usuario@dominio.com"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: "var(--color-text-muted)" }}>MENSAJE</label>
              <textarea
                name="message"
                placeholder="Tu mensaje..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-8 font-bold uppercase tracking-widest transition-all mt-4"
              style={{ background: "var(--color-accent)", color: "var(--color-text)", border: "1px solid var(--color-accent)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-text)"; }}
            >
              ENVIAR_MENSAJE
            </button>
          </form>
        )}

      </div>
    </section>
  );
}