import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminKeywords() {
  const { token } = useContext(AuthContext);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/keywords`)
      .then(r => r.json())
      .then(data => setKeywords(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!newKeyword.trim()) return;
    const res = await fetch(`${API}/keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newKeyword.trim().toLowerCase() }),
    });
    const data = await res.json();
    if (res.ok) {
      setKeywords(prev => [...prev, data.data]);
      setNewKeyword("");
      setError(null);
    } else {
      setError(data.description || data.message || "Error al crear keyword");
    }
  };

  const destroy = async (id) => {
    if (!confirm("¿Eliminar esta keyword?")) return;
    const res = await fetch(`${API}/keywords/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setKeywords(prev => prev.filter(k => k.id_keyword !== id));
  };

  if (loading) return <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>
          KEYWORDS
        </h1>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--color-text-muted)" }}>
          // {keywords.length} KEYWORDS EN TOTAL
        </p>
      </div>

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          value={newKeyword}
          onChange={e => setNewKeyword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && create()}
          placeholder="nueva keyword..."
          className="flex-1 px-3 py-2 text-xs uppercase tracking-widest outline-none"
          style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
          onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
          onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
        />
        <button
          onClick={create}
          className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
        >
          AGREGAR
        </button>
      </div>

      {error && (
        <p className="text-xs uppercase tracking-widest px-3 py-2 mb-4 max-w-md" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}>{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {keywords.map(k => (
          <div
            key={k.id_keyword}
            className="flex items-center gap-2 px-3 py-1 transition-colors"
            style={{ border: "1px solid var(--color-accent-secondary)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-accent-secondary)"}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-accent-secondary)" }}>{k.name}</span>
            <button
              onClick={() => destroy(k.id_keyword)}
              className="text-xs transition-colors"
              style={{ color: "var(--color-accent-secondary)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-accent-secondary)"}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}