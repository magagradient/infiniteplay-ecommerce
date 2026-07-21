import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const FIELD_LABELS = {
  title: { key: "custom_title", label: "Título" },
  artist: { key: "custom_artist_name", label: "Artista" },
  date: { key: "event_date", label: "Fecha y hora" },
  location: { key: "event_location", label: "Lugar" },
};

export default function AdminCustomizations() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPending = () => {
    setLoading(true);
    fetch(`${API}/admin/customizations/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, [token]);

  const startUpload = (id_order, id_product) => {
    setUploadingKey(`${id_order}-${id_product}`);
    setFileUrl("");
    setError(null);
  };

  const handleComplete = async (id_order, id_product) => {
    if (!fileUrl.trim()) {
      setError("Pegá el link del archivo final antes de confirmar.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/customizations/${id_order}/${id_product}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ final_file_url: fileUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.description || data.message || "Error al marcar como listo");
      setUploadingKey(null);
      setFileUrl("");
      fetchPending();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
  };

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest animate-pulse">[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter text-text-primary">
          PERSONALIZACIONES_PENDIENTES
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{items.length}</span> PEDIDO{items.length !== 1 ? "S" : ""} ESPERANDO EDICIÓN
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border border-text-muted/30 p-8 text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest">[SIN_PENDIENTES] // NO HAY PERSONALIZACIONES POR ENTREGAR</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {items.map((item) => {
            const key = `${item.id_order}-${item.id_product}`;
            const requiredFields = item.product?.customization_fields || ["title", "artist"];
            const isUploading = uploadingKey === key;

            return (
              <div key={key} className="border border-accent-secondary/40">
                <div className="flex justify-between items-center px-5 py-3 border-b border-text-muted/20">
                  <span className="text-text-primary text-sm uppercase font-bold">{item.product?.title}</span>
                  <span className="text-text-muted text-xs uppercase">ORDEN #{item.id_order}</span>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-text-muted text-[10px] uppercase tracking-widest">COMPRADOR</p>
                    <p className="text-text-primary text-sm">{item.order?.user?.name} — {item.order?.user?.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {requiredFields.map((fieldName) => {
                      const field = FIELD_LABELS[fieldName];
                      if (!field) return null;
                      const rawValue = item[field.key];
                      const value = fieldName === "date" ? formatDate(rawValue) : rawValue;
                      return (
                        <div key={fieldName}>
                          <p className="text-text-muted text-[10px] uppercase tracking-widest">{field.label}</p>
                          <p className="text-accent-secondary text-sm">{value || "—"}</p>
                        </div>
                      );
                    })}
                  </div>

                  {item.custom_notes && (
                    <div>
                      <p className="text-text-muted text-[10px] uppercase tracking-widest">NOTAS</p>
                      <p className="text-text-primary text-sm">{item.custom_notes}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-text-muted/20">
                    {isUploading ? (
                      <div className="space-y-2">
                        <label className="text-text-muted text-[10px] uppercase tracking-widest block">
                          LINK DEL ARCHIVO FINAL
                        </label>
                        <input
                          value={fileUrl}
                          onChange={(e) => setFileUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-3 py-2 text-xs focus:outline-none focus:border-accent-secondary"
                        />
                        {error && (
                          <p className="text-accent text-xs uppercase tracking-widest">{error}</p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleComplete(item.id_order, item.id_product)}
                            disabled={submitting}
                            className="px-4 py-2 bg-accent text-bg-dark text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40"
                          >
                            {submitting ? "GUARDANDO..." : "CONFIRMAR_ENTREGA"}
                          </button>
                          <button
                            onClick={() => setUploadingKey(null)}
                            className="px-4 py-2 border border-text-muted/30 text-text-muted text-xs uppercase hover:border-accent-secondary hover:text-accent-secondary transition-all"
                          >
                            CANCELAR
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startUpload(item.id_order, item.id_product)}
                        className="px-4 py-2 border border-accent-secondary text-accent-secondary text-xs uppercase tracking-widest hover:bg-accent-secondary hover:text-bg-dark transition-all"
                      >
                        MARCAR_COMO_LISTO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
