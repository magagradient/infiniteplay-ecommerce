import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

const selectStyles = {
  control: (base, state) => ({ ...base, background: "#1d1b20", borderColor: state.isFocused ? "#b08fff" : "#494551", borderRadius: 0, boxShadow: "none", "&:hover": { borderColor: "#b08fff" }, fontFamily: "Space Grotesk", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", minHeight: "32px" }),
  menu: (base) => ({ ...base, background: "#1d1b20", border: "1px solid #494551", borderRadius: 0, zIndex: 99 }),
  menuList: (base) => ({ ...base, padding: 0 }),
  option: (base, state) => ({ ...base, background: state.isSelected ? "#381e72" : state.isFocused ? "#2a1f3d" : "#1d1b20", color: state.isSelected ? "#b08fff" : "#cbc4d2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }),
  singleValue: (base) => ({ ...base, color: "#e6e0e9", fontSize: "11px", textTransform: "uppercase" }),
  multiValue: (base) => ({ ...base, background: "#2a1f3d", borderRadius: 0 }),
  multiValueLabel: (base) => ({ ...base, color: "#b08fff", fontSize: "10px", textTransform: "uppercase" }),
  multiValueRemove: (base) => ({ ...base, color: "#b08fff", "&:hover": { background: "#690005", color: "#fff" } }),
  placeholder: (base) => ({ ...base, color: "#494551", fontSize: "11px", textTransform: "uppercase" }),
  input: (base) => ({ ...base, color: "#e6e0e9", fontSize: "11px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#494551", "&:hover": { color: "#b08fff" }, padding: "4px" }),
  clearIndicator: (base) => ({ ...base, color: "#494551", "&:hover": { color: "#b08fff" }, padding: "4px" }),
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
      title: product.title,
      price: product.price,
      description: product.description || "",
      description_long: product.description_long || "",
      is_sold: product.is_sold,
      visible_in_portfolio: product.visible_in_portfolio,
      id_category: product.category?.id_category || "",
      id_series: product.series?.id_series || "",
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
      body: JSON.stringify({
        ...editForm,
        price: parseFloat(editForm.price),
        id_category: editForm.id_category ? parseInt(editForm.id_category) : undefined,
        id_series: editForm.id_series ? parseInt(editForm.id_series) : null,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      if (colorsChanged) await assignRelation(id, "colors", editColors.map(c => c.value));
      if (keywordsChanged) await assignRelation(id, "keywords", editKeywords.map(k => k.value));
      setProducts((prev) => prev.map((p) =>
        p.id_product === id ? {
          ...p, ...editForm,
          colors: editColors.map(c => ({ id_color: c.value, name: c.label })),
          keywords: editKeywords.map(k => ({ id_keyword: k.value, name: k.label })),
        } : p
      ));
      setEditingId(null);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`${API}/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status === "success") {
      setProducts((prev) => prev.map((p) => p.id_product === id ? { ...p, is_deleted: true } : p));
    }
  };

  const startUpload = (id) => {
    setUploadingId(id);
    setEditingId(null);
    setImageFile(null);
    setImageType("cover");
    setUploadSuccess(false);
  };

  const handleUpload = async (id) => {
    if (!imageFile) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", imageType);
      const res = await fetch(`${API}/products/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setUploadSuccess(true);
        setTimeout(() => { setUploadingId(null); setUploadSuccess(false); setImageFile(null); }, 1500);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) return <p className="text-[#b08fff] text-xs uppercase tracking-widest animate-pulse">[CARGANDO...]</p>;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.4em] mb-3">ADMIN</div>
        <h1 className="text-[#e6e0e9] text-3xl font-bold uppercase tracking-tighter">PRODUCTOS</h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest mt-1">// {products.length} PRODUCTOS EN TOTAL</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs uppercase tracking-widest border-collapse">
          <thead>
            <tr className="border-b border-[#2a1f3d] text-[#6b5b8a]">
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
                <tr className={`border-b border-[#2a1f3d]/60 transition-colors ${p.is_deleted ? "opacity-30" : "hover:bg-[#1a1625]"}`}>
                  <td className="py-3 pr-4 text-[#6b5b8a] font-mono">{p.id_product}</td>
                  <td className="py-3 pr-4 text-[#e6e0e9]">
                    {editingId === p.id_product ? (
                      <input className="bg-[#141218] border border-[#b08fff] text-[#e6e0e9] px-2 py-1 w-full outline-none" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    ) : p.title}
                  </td>
                  <td className="py-3 pr-4 text-[#cbc4d2]">
                    {editingId === p.id_product ? (
                      <input type="number" className="bg-[#141218] border border-[#b08fff] text-[#e6e0e9] px-2 py-1 w-24 outline-none" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    ) : `$${p.price}`}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 text-[10px] ${p.is_sold ? "bg-[#381e72] text-[#b08fff] border border-[#4a2d8f]" : "bg-transparent text-[#494551] border border-[#2a1f3d]"}`}>{p.is_sold ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 text-[10px] ${p.visible_in_portfolio ? "bg-[#1a2540] text-[#7eb8ff] border border-[#2a3a5c]" : "bg-transparent text-[#494551] border border-[#2a1f3d]"}`}>{p.visible_in_portfolio ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 text-[10px] ${p.is_deleted ? "bg-[#690005] text-[#ffb4ab] border border-[#8b0007]" : "bg-transparent text-[#494551] border border-[#2a1f3d]"}`}>{p.is_deleted ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3">
                    {!p.is_deleted && (
                      <div className="flex gap-2 flex-wrap">
                        {editingId === p.id_product ? (
                          <>
                            <button onClick={() => saveEdit(p.id_product)} className="px-3 py-1 bg-[#b08fff] text-[#141218] text-[10px] font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-colors">GUARDAR</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-1 border border-[#494551] text-[#494551] text-[10px] hover:border-[#6b5b8a] hover:text-[#6b5b8a] transition-colors">CANCELAR</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(p)} className="px-3 py-1 border border-[#2a1f3d] text-[#b08fff] text-[10px] hover:border-[#b08fff] hover:bg-[#2a1f3d] transition-colors">EDITAR</button>
                            <button onClick={() => startUpload(p.id_product)} className="px-3 py-1 border border-[#2a1f3d] text-[#cbc4d2] text-[10px] hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-colors">+ IMG</button>
                            <button onClick={() => deleteProduct(p.id_product)} className="px-3 py-1 border border-[#2a1f3d] text-[#494551] text-[10px] hover:border-[#690005] hover:text-[#690005] transition-colors">✕</button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>

                {editingId === p.id_product && (
                  <tr key={`edit-${p.id_product}`} className="border-b border-[#2a1f3d]">
                    <td colSpan={7} className="py-4 px-4 bg-[#1a1625]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-[#b08fff]" />
                        <span className="text-[#b08fff] text-[10px] uppercase tracking-[0.3em]">Editando #{p.id_product}</span>
                        <div className="flex-1 h-px bg-[#2a1f3d]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Descripción corta</label>
                          <textarea rows={2} className="w-full bg-[#141218] border border-[#2a1f3d] text-[#e6e0e9] px-2 py-1 text-xs resize-none outline-none focus:border-[#b08fff] transition-colors" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Descripción larga</label>
                          <textarea rows={2} className="w-full bg-[#141218] border border-[#2a1f3d] text-[#e6e0e9] px-2 py-1 text-xs resize-none outline-none focus:border-[#b08fff] transition-colors" value={editForm.description_long} onChange={(e) => setEditForm({ ...editForm, description_long: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Categoría</label>
                          <Select options={categories.map(c => ({ value: c.id_category, label: c.name }))} value={categories.find(c => c.id_category === editForm.id_category) ? { value: editForm.id_category, label: categories.find(c => c.id_category === editForm.id_category)?.name } : null} onChange={opt => setEditForm({ ...editForm, id_category: opt ? opt.value : "" })} placeholder="-- Categoría --" isClearable styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Serie</label>
                          <Select options={seriesList.map(s => ({ value: s.id_series, label: s.title }))} value={seriesList.find(s => s.id_series === editForm.id_series) ? { value: editForm.id_series, label: seriesList.find(s => s.id_series === editForm.id_series)?.title } : null} onChange={opt => setEditForm({ ...editForm, id_series: opt ? opt.value : "" })} placeholder="-- Sin serie --" isClearable styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Colores</label>
                          <Select isMulti options={colorsList.map(c => ({ value: c.id_color, label: c.name }))} value={editColors} onChange={(val) => { setEditColors(val); setColorsChanged(true); }} placeholder="-- Colores --" styles={selectStyles} />
                        </div>
                        <div>
                          <label className="text-[#6b5b8a] text-[10px] uppercase tracking-widest block mb-1">Keywords</label>
                          <Select isMulti options={keywordsList.map(k => ({ value: k.id_keyword, label: k.name }))} value={editKeywords} onChange={(val) => { setEditKeywords(val); setKeywordsChanged(true); }} placeholder="-- Keywords --" styles={selectStyles} />
                        </div>
                      </div>
                      <div className="flex gap-6 pt-2 border-t border-[#2a1f3d]">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={editForm.is_sold} onChange={(e) => setEditForm({ ...editForm, is_sold: e.target.checked })} className="accent-[#b08fff] w-3 h-3" />
                          <span className="text-[#6b5b8a] text-[10px] uppercase tracking-widest group-hover:text-[#b08fff] transition-colors">Vendido</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={editForm.visible_in_portfolio} onChange={(e) => setEditForm({ ...editForm, visible_in_portfolio: e.target.checked })} className="accent-[#b08fff] w-3 h-3" />
                          <span className="text-[#6b5b8a] text-[10px] uppercase tracking-widest group-hover:text-[#b08fff] transition-colors">Visible en catálogo</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                )}

                {uploadingId === p.id_product && (
                  <tr key={`upload-${p.id_product}`} className="border-b border-[#2a1f3d]">
                    <td colSpan={7} className="py-4 px-4 bg-[#1a1625]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-[#ffb4ab]" />
                        <span className="text-[#ffb4ab] text-[10px] uppercase tracking-[0.3em]">Subir imagen #{p.id_product}</span>
                        <div className="flex-1 h-px bg-[#2a1f3d]" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select value={imageType} onChange={e => setImageType(e.target.value)} className="bg-[#141218] border border-[#2a1f3d] text-[#e6e0e9] px-3 py-2 text-[10px] uppercase tracking-widest focus:border-[#b08fff] outline-none">
                          <option value="cover">COVER</option>
                          <option value="banner">BANNER</option>
                        </select>
                        <label className="px-4 py-2 border border-[#2a1f3d] text-[#cbc4d2] text-[10px] uppercase tracking-widest hover:border-[#b08fff] hover:text-[#b08fff] transition-colors cursor-pointer">
                          {imageFile ? imageFile.name.substring(0, 20) + "..." : "ELEGIR ARCHIVO"}
                          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
                        </label>
                        {uploadSuccess ? (
                          <span className="text-[#b08fff] text-[10px] uppercase tracking-widest">✓ IMAGEN SUBIDA</span>
                        ) : (
                          <button onClick={() => handleUpload(p.id_product)} disabled={!imageFile || uploadLoading} className="px-4 py-2 bg-[#b08fff] text-[#141218] text-[10px] font-bold uppercase tracking-widest hover:bg-[#ffb4ab] hover:text-[#690005] disabled:opacity-40 transition-colors">
                            {uploadLoading ? "SUBIENDO..." : "SUBIR"}
                          </button>
                        )}
                        <button onClick={() => setUploadingId(null)} className="px-3 py-2 border border-[#2a1f3d] text-[#494551] text-[10px] uppercase tracking-widest hover:border-[#494551] hover:text-[#cbc4d2] transition-colors">CANCELAR</button>
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