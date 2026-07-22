import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/api"; // implementá changePassword({ token, currentPassword, newPassword })
import { getPasswordError, passwordsMatch } from "../../utils/validators";

export default function ChangePassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/account/login");
        return null;
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.currentPassword) {
            setError("Ingresá tu contraseña actual.");
            return;
        }

        const passwordError = getPasswordError(form.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (!passwordsMatch(form.newPassword, form.confirmPassword)) {
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            await changePassword({ token, currentPassword: form.currentPassword, newPassword: form.newPassword });
            setSuccess("Contraseña actualizada correctamente.");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            // opcional: forzar logout
            // localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/account/login");
        } catch (err) {
            console.error(err);
            setError(err?.message || "Error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-bg-dark flex items-center justify-center px-4" style={{ fontFamily: "Space Grotesk" }}>
            <div className="w-full max-w-md border border-text-muted/30 p-8">

                <div className="mb-8">
                    <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
                        SEGURIDAD
                    </div>
                    <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none">
                        CAMBIAR_CONTRASEÑA
                    </h1>
                </div>

                {error && (
                    <p className="text-accent text-xs uppercase tracking-widest mb-4 border border-accent px-4 py-2">
                        [ERROR] {error}
                    </p>
                )}
                {success && (
                    <p className="text-accent-secondary text-xs uppercase tracking-widest mb-4 border border-accent-secondary px-4 py-2">
                        [OK] {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">CONTRASEÑA ACTUAL</label>
                        <input
                            name="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-4 py-3 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">NUEVA CONTRASEÑA</label>
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-4 py-3 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
                        />
                        <p className="text-text-muted/70 text-[10px] uppercase tracking-widest mt-1">
                            Mínimo 8 caracteres, con al menos una letra y un número.
                        </p>
                    </div>

                    <div>
                        <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">CONFIRMAR NUEVA CONTRASEÑA</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
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
                        {loading ? "[GUARDANDO...]" : "GUARDAR_NUEVA_CONTRASEÑA"}
                    </button>
                </form>

            </div>
        </section>
    );
}
