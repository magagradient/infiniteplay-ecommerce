import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminCategories() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCategories(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setCategories(prev => [...prev, data.data]);
      setNewCategory("");
      setError(null);
    } else {
      setError(data.description || data.message || "Error al crear categoría");
    }
  };

  const destroy = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const res = await fetch(`${API}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setCategories(prev => prev.filter(c => c.id_category !== id));
  };

  if (loading) return <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>
          CATEGORÍAS
        </h1>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--color-text-muted)" }}>
          // {categories.length} CATEGORÍAS EN TOTAL
        </p>
      </div>

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => e.key === "Enter" && create()}
          placeholder="nueva categoría..."
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
        {categories.map(c => (
          <div
            key={c.id_category}
            className="flex items-center gap-2 px-3 py-1 transition-colors"
            style={{ border: "1px solid var(--color-accent-secondary)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-accent-secondary)"}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-accent-secondary)" }}>{c.name}</span>
            <button
              onClick={() => destroy(c.id_category)}
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