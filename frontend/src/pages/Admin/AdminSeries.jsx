import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminSeries() {
  const { token } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [newSeries, setNewSeries] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/series`)
      .then(r => r.json())
      .then(data => setSeries(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!newSeries.trim()) return;
    const res = await fetch(`${API}/series`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newSeries.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setSeries(prev => [...prev, data.data]);
      setNewSeries("");
      setError(null);
    } else {
      setError(data.description || data.message || "Error al crear serie");
    }
  };

  const destroy = async (id) => {
    if (!confirm("¿Eliminar esta serie?")) return;
    const res = await fetch(`${API}/series/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSeries(prev => prev.filter(s => s.id_series !== id));
    }
  };

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest">[CARGANDO...]</p>;

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tighter">
          SERIES
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{series.length}</span> SERIES EN TOTAL
        </p>
      </div>

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          value={newSeries}
          onChange={e => setNewSeries(e.target.value)}
          onKeyDown={e => e.key === "Enter" && create()}
          placeholder="nueva serie..."
          className="flex-1 bg-bg-light border border-text-muted/30 text-text-primary px-3 py-2 text-xs uppercase tracking-widest focus:border-accent-secondary outline-none"
        />
        <button
          onClick={create}
          className="px-4 py-2 bg-accent text-bg-dark text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          AGREGAR
        </button>
      </div>

      {error && (
        <p className="text-accent text-xs uppercase tracking-widest border border-accent px-3 py-2 mb-4 max-w-md">{error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {series.map(s => (
          <div
            key={s.id_series}
            className="flex items-center gap-2 border border-accent-secondary/40 px-3 py-1 hover:border-accent-secondary transition-colors"
          >
            <span className="text-accent-secondary text-xs uppercase tracking-widest">{s.title}</span>
            <button
              onClick={() => destroy(s.id_series)}
              className="text-accent-secondary hover:text-accent transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}