import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminStudio() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategory, setNewCategory] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [resourceFile, setResourceFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadCategories = () => {
    fetch(`${API}/studio/categories`, {
      headers: { Authorization: `Bearer ${token}` },  // 👈 esto faltaba
    })
      .then(r => r.json())
      .then(data => setCategories(data.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadCategories(); }, []);

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch(`${API}/studio/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewCategory("");
      setError(null);
      loadCategories();
    } else {
      setError(data.description || data.message || "Error al crear categoría");
    }
  };

  const destroyCategory = async (id) => {
    if (!confirm("¿Eliminar esta categoría? Se borran también sus recursos.")) return;
    const res = await fetch(`${API}/studio/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadCategories();
  };

  const createResource = async () => {
    if (!resourceName.trim() || !selectedCategory || !resourceFile) {
      setError("Completá nombre, categoría e imagen.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("name", resourceName.trim());
    formData.append("id_studio_category", selectedCategory);
    formData.append("image", resourceFile); // ⚠️ confirmar nombre del campo según multer

    const res = await fetch(`${API}/studio/resources`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setResourceName("");
      setResourceFile(null);
      setError(null);
      loadCategories();
    } else {
      setError(data.description || data.message || "Error al crear recurso");
    }
  };

  const destroyResource = async (id) => {
    if (!confirm("¿Eliminar este recurso?")) return;
    const res = await fetch(`${API}/studio/resources/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadCategories();
  };

  if (loading) {
    return (
      <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
        [CARGANDO...]
      </p>
    );
  }

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div
          className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3"
          style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
        >
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>
          STUDIO
        </h1>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--color-text-muted)" }}>
          // {categories.length} CATEGORÍAS · {categories.reduce((acc, c) => acc + (c.resources?.length || 0), 0)} RECURSOS
        </p>
      </div>

      {error && (
        <p
          className="text-xs uppercase tracking-widest px-3 py-2 mb-6 max-w-md"
          style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}
        >
          {error}
        </p>
      )}

      {/* Crear categoría */}
      <div className="mb-10">
        <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
          NUEVA CATEGORÍA
        </h2>
        <div className="flex gap-3 max-w-md">
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === "Enter" && createCategory()}
            placeholder="nombre de categoría..."
            className="flex-1 px-3 py-2 text-xs uppercase tracking-widest outline-none"
            style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
          />
          <button
            onClick={createCategory}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
          >
            AGREGAR
          </button>
        </div>
      </div>

      {/* Crear recurso */}
      <div className="mb-10">
        <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
          NUEVO RECURSO
        </h2>
        <div className="flex flex-col gap-3 max-w-md">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs uppercase tracking-widest outline-none"
            style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
          >
            <option value="">SELECCIONÁ CATEGORÍA</option>
            {categories.map(c => (
              <option key={c.id_studio_category} value={c.id_studio_category}>{c.name}</option>
            ))}
          </select>
          <input
            value={resourceName}
            onChange={e => setResourceName(e.target.value)}
            placeholder="nombre del recurso..."
            className="px-3 py-2 text-xs uppercase tracking-widest outline-none"
            style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setResourceFile(e.target.files[0])}
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          />
          <button
            onClick={createResource}
            disabled={uploading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
          >
            {uploading ? "SUBIENDO..." : "AGREGAR RECURSO"}
          </button>
        </div>
      </div>

      {/* Listado por categoría */}
      <div className="flex flex-col gap-8">
        {categories.map(cat => (
          <div key={cat.id_studio_category}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--color-accent-secondary)" }}>
                {cat.name}
              </h3>
              <button
                onClick={() => destroyCategory(cat.id_studio_category)}
                className="text-xs uppercase tracking-widest transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
              >
                ELIMINAR CATEGORÍA
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(cat.resources || []).map(r => (
                <div
                  key={r.id_studio_resource}
                  className="flex flex-col items-center gap-2 p-2"
                  style={{ border: "1px solid var(--color-text-muted)" }}
                >
                  <img src={r.url} alt={r.name} className="w-16 h-16 object-cover" />
                  <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text)" }}>{r.name}</span>
                  <button
                    onClick={() => destroyResource(r.id_studio_resource)}
                    className="text-xs"
                    style={{ color: "var(--color-accent-secondary)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--color-accent-secondary)"}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {(!cat.resources || cat.resources.length === 0) && (
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  SIN RECURSOS
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}