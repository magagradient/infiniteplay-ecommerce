import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo simula el envío
    setSent(true);
  };

  return (
    <section className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>
      <div className="max-w-xl">

        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
            CONTACTO
          </div>
          <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none mb-2">
            ESCRIBIME
          </h1>
          <p className="text-[#cbc4d2] text-xs uppercase tracking-widest border-l border-[#ffb4ab] pl-4">
            // ¿TENÉS UNA PROPUESTA O QUERÉS COLABORAR?
          </p>
        </div>

        {sent ? (
          <div className="border border-[#494551] px-6 py-4 text-[#ffb4ab] text-xs uppercase tracking-widest">
            [STATUS: 200] // MENSAJE_ENVIADO — TE RESPONDO A LA BREVEDAD
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#cbc4d2] text-xs uppercase tracking-widest mb-1 block">NOMBRE</label>
              <input
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-4 py-3 text-sm focus:outline-none focus:border-[#ffb4ab] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#cbc4d2] text-xs uppercase tracking-widest mb-1 block">EMAIL</label>
              <input
                name="email"
                type="email"
                placeholder="usuario@dominio.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-4 py-3 text-sm focus:outline-none focus:border-[#ffb4ab] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#cbc4d2] text-xs uppercase tracking-widest mb-1 block">MENSAJE</label>
              <textarea
                name="message"
                placeholder="Tu mensaje..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-4 py-3 text-sm focus:outline-none focus:border-[#ffb4ab] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#ffb4ab] text-[#690005] font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all mt-4"
            >
              ENVIAR_MENSAJE
            </button>
          </form>
        )}

      </div>
    </section>
  );
}