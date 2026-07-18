import { useState } from "react";
import { forgotPassword } from "../../services/api"; // implementá requestPasswordReset(email)

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            await forgotPassword(email);
            setMessage("Si el correo existe, recibirá un email con instrucciones para restablecer la contraseña.");
            setEmail("");
        } catch (err) {
            console.error(err);
            setError(err?.message || "Error al solicitar restablecimiento.");
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
                        RECUPERAR_ACCESO
                    </h1>
                </div>

                {message && (
                    <p className="text-accent-secondary text-xs uppercase tracking-widest mb-4 border border-accent-secondary px-4 py-2">
                        [OK] {message}
                    </p>
                )}
                {error && (
                    <p className="text-accent text-xs uppercase tracking-widest mb-4 border border-accent px-4 py-2">
                        [ERROR] {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-text-muted text-xs uppercase tracking-widest mb-1 block">EMAIL</label>
                        <input
                            type="email"
                            placeholder="usuario@dominio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-4 py-3 text-sm focus:outline-none focus:border-accent-secondary transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-accent text-bg-dark font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-accent hover:text-accent transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? "[ENVIANDO...]" : "SOLICITAR_RESTABLECIMIENTO"}
                    </button>
                </form>

            </div>
        </section>
    );
}