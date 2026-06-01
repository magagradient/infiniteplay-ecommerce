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

  if (loading) return <p className="text-[#cbc4d2] text-xs uppercase tracking-widest">[CARGANDO...]</p>;

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-[#e6e0e9] text-3xl font-bold uppercase tracking-tighter">
          SERIES
        </h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest mt-1">
          // {series.length} SERIES EN TOTAL
        </p>
      </div>

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          value={newSeries}
          onChange={e => setNewSeries(e.target.value)}
          onKeyDown={e => e.key === "Enter" && create()}
          placeholder="nueva serie..."
          className="flex-1 bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-xs uppercase tracking-widest focus:border-[#ffb4ab] outline-none"
        />
        <button
          onClick={create}
          className="px-4 py-2 bg-[#ffb4ab] text-[#690005] text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          AGREGAR
        </button>
      </div>

      {error && (
        <p className="text-[#690005] text-xs uppercase tracking-widest border border-[#690005] px-3 py-2 mb-4 max-w-md">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {series.map(s => (
          <div
            key={s.id_series}
            className="flex items-center gap-2 border border-[#494551] px-3 py-1 hover:border-[#ffb4ab] transition-colors"
          >
            <span className="text-[#cbc4d2] text-xs uppercase tracking-widest">{s.title}</span>
            <button
              onClick={() => destroy(s.id_series)}
              className="text-[#494551] hover:text-[#690005] transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}