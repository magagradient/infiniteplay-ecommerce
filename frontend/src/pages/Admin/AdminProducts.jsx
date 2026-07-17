import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

const selectStyles = {
  control: (base, state) => ({ ...base, background: "var(--color-bg-light)", borderColor: state.isFocused ? "var(--color-accent)" : "var(--color-text-muted)", borderRadius: 0, boxShadow: "none", "&:hover": { borderColor: "var(--color-accent)" }, fontFamily: "Space Grotesk", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", minHeight: "32px" }),
  menu: (base) => ({ ...base, background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", borderRadius: 0, zIndex: 99 }),
  menuList: (base) => ({ ...base, padding: 0 }),
  option: (base, state) => ({ ...base, background: state.isSelected ? "var(--color-accent)" : state.isFocused ? "var(--color-bg-dark)" : "var(--color-bg-light)", color: state.isSelected ? "var(--color-text)" : "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }),
  singleValue: (base) => ({ ...base, color: "var(--color-text)", fontSize: "11px", textTransform: "uppercase" }),
  multiValue: (base) => ({ ...base, background: "var(--color-accent-secondary)", borderRadius: 0 }),
  multiValueLabel: (base) => ({ ...base, color: "var(--color-bg-dark)", fontSize: "10px", textTransform: "uppercase" }),
  multiValueRemove: (base) => ({ ...base, color: "var(--color-bg-dark)", "&:hover": { background: "var(--color-accent)", color: "var(--color-text)" } }),
  placeholder: (base) => ({ ...base, color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase" }),
  input: (base) => ({ ...base, color: "var(--color-text)", fontSize: "11px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "var(--color-text-muted)", "&:hover": { color: "var(--color-accent)" }, padding: "4px" }),
  clearIndicator: (base) => ({ ...base, color: "var(--color-text-muted)", "&:hover": { color: "var(--color-accent)" }, padding: "4px" }),
  valueContainer: (base) => ({ ...base, padding: "2px 8px" }),
};

export default function AdminProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editColors, setEditColors] = useState([]);
  const [editKeywords, setEditKeywords] = useState([]);
  const [colorsChanged, setColorsChanged] = useState(false);
  const [keywordsChanged, setKeywordsChanged] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageType, setImageType] = useState("cover");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/products`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setProducts(data.data || []))
      .finally(() => setLoading(false));
    fetch(`${API}/categories`).then(r => r.json()).then(d => setCategories(d.data || []));
    fetch(`${API}/series`).then(r => r.json()).then(d => setSeriesList(d.data || []));
    fetch(`${API}/colors`).then(r => r.json()).then(d => setColorsList(d.data || []));
    fetch(`${API}/keywords`).then(r => r.json()).then(d => setKeywordsList(d.data || []));
  }, [token]);

  const startEdit = (product) => {
    setEditingId(product.id_product);
    setUploadingId(null);
    setEditForm({
      title: product.title, price: product.price,
      description: product.description || "", description_long: product.description_long || "",
      is_sold: product.is_sold, visible_in_portfolio: product.visible_in_portfolio,
      id_category: product.category?.id_category || "", id_series: product.series?.id_series || "",
    });
    setEditColors((product.colors || []).map(c => ({ value: c.id_color, label: c.name })));
    setEditKeywords((product.keywords || []).map(k => ({ value: k.id_keyword, label: k.name })));
    setColorsChanged(false);
    setKeywordsChanged(false);
  };

  const assignRelation = async (productId, relationType, ids) => {
    await fetch(`${API}/products/${productId}/assign/${relationType}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids }),
    });
  };

  const saveEdit = async (id) => {
    const res = await fetch(`${API}/admin/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, price: parseFloat(editForm.price), id_category: editForm.id_category ? parseInt(editForm.id_category) : undefined, id_series: editForm.id_series ? parseInt(editForm.id_series) : null }),
    });
    const data = await res.json();
    if (data.status === "success") {
      if (colorsChanged) await assignRelation(id, "colors", editColors.map(c => c.value));
      if (keywordsChanged) await assignRelation(id, "keywords", editKeywords.map(k => k.value));
      setProducts((prev) => prev.map((p) => p.id_product === id ? { ...p, ...editForm, colors: editColors.map(c => ({ id_color: c.value, name: c.label })), keywords: editKeywords.map(k => ({ id_keyword: k.value, name: k.label })) } : p));
      setEditingId(null);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`${API}/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.status === "success") setProducts((prev) => prev.map((p) => p.id_product === id ? { ...p, is_deleted: true } : p));
  };

  const startUpload = (id) => { setUploadingId(id); setEditingId(null); setImageFile(null); setImageType("cover"); setUploadSuccess(false); };

  const handleUpload = async (id) => {
    if (!imageFile) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", imageType);
      const res = await fetch(`${API}/products/${id}/upload-image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { setUploadSuccess(true); setTimeout(() => { setUploadingId(null); setUploadSuccess(false); setImageFile(null); }, 1500); }
    } catch (err) { console.error("Error al subir imagen:", err); }
    finally { setUploadLoading(false); }
  };

  if (loading) return <p className="text-xs uppercase tracking-widest animate-pulse" style={{ color: "var(--color-accent-secondary)" }}>[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>ADMIN</div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>PRODUCTOS</h1>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--color-text-muted)" }}>// {products.length} PRODUCTOS EN TOTAL</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs uppercase tracking-widest border-collapse">
          <thead>
            <tr className="border-b text-xs" style={{ borderColor: "var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              <th className="text-left py-3 pr-4">ID</th>
              <th className="text-left py-3 pr-4">Título</th>
              <th className="text-left py-3 pr-4">Precio</th>
              <th className="text-left py-3 pr-4">Vendido</th>
              <th className="text-left py-3 pr-4">Visible</th>
              <th className="text-left py-3 pr-4">Eliminado</th>
              <th className="text-left py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id_product}>
                <tr className="border-b transition-colors" style={{ borderColor: "var(--color-text-muted)", opacity: p.is_deleted ? 0.3 : 1 }}
                  onMouseEnter={e => { if (!p.is_deleted) e.currentTarget.style.background = "var(--color-bg-light)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <td className="py-3 pr-4 font-mono" style={{ color: "var(--color-text-muted)" }}>{p.id_product}</td>
                  <td className="py-3 pr-4" style={{ color: "var(--color-text)" }}>
                    {editingId === p.id_product ? (
                      <input className="px-2 py-1 w-full outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-accent)", color: "var(--color-text)" }} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    ) : p.title}
                  </td>
                  <td className="py-3 pr-4" style={{ color: "var(--color-text-muted)" }}>
                    {editingId === p.id_product ? (
                      <input type="number" className="px-2 py-1 w-24 outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-accent)", color: "var(--color-text)" }} value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    ) : `$${p.price}`}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.is_sold ? "var(--color-accent)" : "transparent", color: p.is_sold ? "var(--color-text)" : "var(--color-text-muted)", border: `1px solid ${p.is_sold ? "var(--color-accent)" : "var(--color-text-muted)"}` }}>{p.is_sold ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.visible_in_portfolio ? "var(--color-accent-secondary)" : "transparent", color: p.visible_in_portfolio ? "var(--color-bg-dark)" : "var(--color-text-muted)", border: `1px solid ${p.visible_in_portfolio ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}` }}>{p.visible_in_portfolio ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.is_deleted ? "var(--color-accent)" : "transparent", color: p.is_deleted ? "var(--color-text)" : "var(--color-text-muted)", border: `1px solid ${p.is_deleted ? "var(--color-accent)" : "var(--color-text-muted)"}` }}>{p.is_deleted ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3">
                    {!p.is_deleted && (
                      <div className="flex gap-2 flex-wrap">
                        {editingId === p.id_product ? (
                          <>
                            <button onClick={() => saveEdit(p.id_product)} className="px-3 py-1 text-[10px] font-bold transition-colors" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>GUARDAR</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>CANCELAR</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(p)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>EDITAR</button>
                            <button onClick={() => startUpload(p.id_product)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>+ IMG</button>
                            <button onClick={() => deleteProduct(p.id_product)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>✕</button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>

                {editingId === p.id_product && (
                  <tr key={`edit-${p.id_product}`} className="border-b" style={{ borderColor: "var(--color-bg-light)" }}>
                    <td colSpan={7} className="py-4 px-4" style={{ background: "var(--color-bg-light)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4" style={{ background: "var(--color-accent-secondary)" }} />
                        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--color-accent-secondary)" }}>Editando #{p.id_product}</span>
                        <div className="flex-1 h-px" style={{ background: "var(--color-text-muted)" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Descripción corta</label>
                          <textarea rows={2} className="w-full px-2 py-1 text-xs resize-none outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} onFocus={e => e.target.style.borderColor = "var(--color-accent)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Descripción larga</label>
                          <textarea rows={2} className="w-full px-2 py-1 text-xs resize-none outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }} value={editForm.description_long} onChange={(e) => setEditForm({ ...editForm, description_long: e.target.value })} onFocus={e => e.target.style.borderColor = "var(--color-accent)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Categoría</label>
                          <Select options={categories.map(c => ({ value: c.id_category, label: c.name }))} value={categories.find(c => c.id_category === editForm.id_category) ? { value: editForm.id_category, label: categories.find(c => c.id_category === editForm.id_category)?.name } : null} onChange={opt => setEditForm({ ...editForm, id_category: opt ? opt.value : "" })} placeholder="-- Categoría --" isClearable styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Serie</label>
                          <Select options={seriesList.map(s => ({ value: s.id_series, label: s.title }))} value={seriesList.find(s => s.id_series === editForm.id_series) ? { value: editForm.id_series, label: seriesList.find(s => s.id_series === editForm.id_series)?.title } : null} onChange={opt => setEditForm({ ...editForm, id_series: opt ? opt.value : "" })} placeholder="-- Sin serie --" isClearable styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Colores</label>
                          <Select isMulti options={colorsList.map(c => ({ value: c.id_color, label: c.name }))} value={editColors} onChange={(val) => { setEditColors(val); setColorsChanged(true); }} placeholder="-- Colores --" styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Keywords</label>
                          <Select isMulti options={keywordsList.map(k => ({ value: k.id_keyword, label: k.name }))} value={editKeywords} onChange={(val) => { setEditKeywords(val); setKeywordsChanged(true); }} placeholder="-- Keywords --" styles={selectStyles} />
                        </div>
                      </div>
                      <div className="flex gap-6 pt-2 border-t" style={{ borderColor: "var(--color-text-muted)" }}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editForm.is_sold} onChange={(e) => setEditForm({ ...editForm, is_sold: e.target.checked })} className="w-3 h-3" style={{ accentColor: "var(--color-accent)" }} />
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Vendido</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editForm.visible_in_portfolio} onChange={(e) => setEditForm({ ...editForm, visible_in_portfolio: e.target.checked })} className="w-3 h-3" style={{ accentColor: "var(--color-accent-secondary)" }} />
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Visible en catálogo</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                )}

                {uploadingId === p.id_product && (
                  <tr key={`upload-${p.id_product}`} className="border-b" style={{ borderColor: "var(--color-bg-light)" }}>
                    <td colSpan={7} className="py-4 px-4" style={{ background: "var(--color-bg-light)" }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4" style={{ background: "var(--color-accent)" }} />
                        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--color-accent)" }}>Subir imagen #{p.id_product}</span>
                        <div className="flex-1 h-px" style={{ background: "var(--color-text-muted)" }} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select value={imageType} onChange={e => setImageType(e.target.value)} className="px-3 py-2 text-[10px] uppercase tracking-widest outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}>
                          <option value="cover">COVER</option>
                          <option value="banner">BANNER</option>
                        </select>
                        <label className="px-4 py-2 text-[10px] uppercase tracking-widest transition-colors cursor-pointer" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>
                          {imageFile ? imageFile.name.substring(0, 20) + "..." : "ELEGIR ARCHIVO"}
                          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
                        </label>
                        {uploadSuccess ? (
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-accent-secondary)" }}>✓ IMAGEN SUBIDA</span>
                        ) : (
                          <button onClick={() => handleUpload(p.id_product)} disabled={!imageFile || uploadLoading} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 transition-colors" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                            {uploadLoading ? "SUBIENDO..." : "SUBIR"}
                          </button>
                        )}
                        <button onClick={() => setUploadingId(null)} className="px-3 py-2 text-[10px] uppercase tracking-widest transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>CANCELAR</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}