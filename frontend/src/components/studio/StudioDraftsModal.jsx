import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function StudioDraftsModal({
  isOpen, onClose, token, format, elements, imageUrl, imageFile, idProduct, onLoadDraft,
}) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDrafts = () => {
    setLoading(true);
    fetch(`${API}/studio/drafts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setDrafts(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (isOpen) fetchDrafts(); }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", nameInput.trim());
      formData.append("format", format);
      formData.append("elements", JSON.stringify(elements));
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl && !imageUrl.startsWith("blob:")) {
        formData.append("background_image_url", imageUrl);
      }

      if (idProduct) formData.append("id_product", idProduct);

      const res = await fetch(`${API}/studio/drafts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Error al guardar el borrador");
      setNameInput("");
      fetchDrafts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/studio/drafts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDrafts();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg max-h-[80vh] flex flex-col"
        style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)" }}>

        <div className="flex justify-between items-center p-4" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text)" }}>Mis borradores</span>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}>✕</button>
        </div>

        <div className="p-4 flex gap-2" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
          <input value={nameInput} onChange={e => setNameInput(e.target.value)}
            placeholder="Nombre del borrador"
            className="flex-1 px-3 py-2 text-xs uppercase tracking-widest outline-none"
            style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }} />
          <button onClick={handleSave} disabled={saving || !nameInput.trim()}
            className="px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap"
            style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)", opacity: saving || !nameInput.trim() ? 0.5 : 1 }}>
            {saving ? "Guardando..." : "💾 Guardar actual"}
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Cargando...</p>
          ) : drafts.length === 0 ? (
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Todavía no guardaste ningún borrador</p>
          ) : (
            <div className="space-y-2">
              {drafts.map(draft => (
                <div key={draft.id_studio_draft} className="flex items-center justify-between px-3 py-2"
                  style={{ border: "1px solid var(--color-text-muted)" }}>
                  <div>
                    <p className="text-xs uppercase" style={{ color: "var(--color-text)" }}>{draft.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {new Date(draft.updated_at || draft.created_at).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { onLoadDraft(draft); onClose(); }}
                      className="px-3 py-1 text-xs uppercase tracking-widest"
                      style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
                      Cargar
                    </button>
                    <button onClick={() => handleDelete(draft.id_studio_draft)}
                      className="px-3 py-1 text-xs uppercase tracking-widest"
                      style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}