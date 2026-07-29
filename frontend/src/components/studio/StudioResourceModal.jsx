import { useState, useEffect } from "react";

export default function StudioResourceModal({
  isOpen, onClose, categories, fonts, onSelectResource, onApplyFont,
  initialTab = "images", selectedElement,
}) {
  const [tab, setTab] = useState(initialTab);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      if (categories.length > 0 && activeCategory === null) {
        setActiveCategory(categories[0].id_studio_category);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab, isOpen, categories]);

  if (!isOpen) return null;

  const activeResources = (categories.find(c => c.id_studio_category === activeCategory)?.resources || [])
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col"
        style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)" }}>

        <div className="flex justify-between items-center p-4" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
          <div className="flex gap-2">
            <button onClick={() => setTab("images")}
              className="px-4 py-2 text-xs uppercase tracking-widest"
              style={{ background: tab === "images" ? "var(--color-accent)" : "transparent", color: tab === "images" ? "var(--color-text)" : "var(--color-text-muted)" }}>
              Imágenes
            </button>
            <button onClick={() => setTab("fonts")}
              className="px-4 py-2 text-xs uppercase tracking-widest"
              style={{ background: tab === "fonts" ? "var(--color-accent)" : "transparent", color: tab === "fonts" ? "var(--color-text)" : "var(--color-text-muted)" }}>
              Fuentes
            </button>
          </div>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}>✕</button>
        </div>

        {tab === "images" && categories.length > 0 && (
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto" style={{ borderBottom: "1px solid var(--color-text-muted)", paddingBottom: 12 }}>
            {categories.map(cat => (
              <button key={cat.id_studio_category} onClick={() => setActiveCategory(cat.id_studio_category)}
                className="px-3 py-1 text-xs uppercase tracking-widest whitespace-nowrap flex-shrink-0"
                style={{
                  background: activeCategory === cat.id_studio_category ? "var(--color-accent-secondary)" : "transparent",
                  color: activeCategory === cat.id_studio_category ? "var(--color-bg-dark)" : "var(--color-text-muted)",
                  border: `1px solid ${activeCategory === cat.id_studio_category ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}`,
                }}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1">
          <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 text-xs"
            style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }} />

          {tab === "images" ? (
            categories.length === 0 ? (
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                Todavía no hay categorías cargadas
              </p>
            ) : activeResources.length === 0 ? (
              <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                Sin recursos en esta categoría
              </p>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                {activeResources.map(res => (
                  <button key={res.id_studio_resource} onClick={() => { onSelectResource(res); onClose(); }}
                    title={res.name} className="aspect-square flex items-center justify-center"
                    style={{ border: "1px solid var(--color-text-muted)", background: "var(--color-bg-light)" }}>
                    <img src={res.url} alt={res.name} className="max-w-full max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-2">
              {(!selectedElement || selectedElement.type !== "text") && (
                <p className="text-xs uppercase tracking-widest pb-2" style={{ color: "var(--color-accent)" }}>
                  Seleccioná un texto en el canvas para aplicar una fuente
                </p>
              )}
              {fonts.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(font => (
                <button key={font.id_studio_font}
                  disabled={!selectedElement || selectedElement.type !== "text"}
                  onClick={() => { onApplyFont(font.google_font_name); onClose(); }}
                  className="w-full text-left px-4 py-3"
                  style={{
                    border: "1px solid var(--color-text-muted)",
                    opacity: (!selectedElement || selectedElement.type !== "text") ? 0.4 : 1,
                    fontFamily: font.google_font_name, fontSize: 20,
                    color: "var(--color-text)", background: "var(--color-bg-light)",
                  }}>
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
