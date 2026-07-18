import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/account/profile");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-bg-dark flex items-center justify-center px-4" style={{ fontFamily: "Space Grotesk" }}>
      <div className="w-full max-w-md border border-bg-light p-8">

        <div className="mb-8">
          <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
            SYSTEM_ACCESS
          </div>
          <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none">
            INICIAR_SESIÓN
          </h1>
        </div>

        {error && (
          <p className="text-accent text-xs uppercase tracking-widest mb-4 border border-accent px-4 py-2">
            [ERROR] {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">EMAIL</label>
            <input
              name="email"
              type="email"
              placeholder="usuario@dominio.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-4 py-3 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
            />
          </div>

          <div>
            <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">CONTRASEÑA</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-4 py-3 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-bg-dark font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-accent hover:text-accent transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "[PROCESANDO...]" : "INGRESAR_AL_SISTEMA"}
          </button>
        </form>

        <div className="mt-6 text-xs uppercase tracking-widest text-text-muted space-y-2">
          <Link to="/account/forgot-password" className="block hover:text-accent-secondary transition-colors">
            → OLVIDÉ_MI_CONTRASEÑA
          </Link>
          <Link to="/account/register" className="block hover:text-accent-secondary transition-colors">
            → NO_TENGO_CUENTA
          </Link>
        </div>

      </div>
    </section>
  );
}