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
  multiValueRemove: (base) => ({ ...base, color: "var(--color-bg-dark)", "&:hover": { background: "var(--color-accent-hover)", color: "var(--color-text)" } }),
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

  const [detailsId, setDetailsId] = useState(null);
  const [newDetail, setNewDetail] = useState({ label: "", value: "" });
  const [detailsSubmitting, setDetailsSubmitting] = useState(false);

  const [resourcesId, setResourcesId] = useState(null);
  const [newResource, setNewResource] = useState({ id_category: "", quantity: 1 });
  const [resourceSubmitting, setResourceSubmitting] = useState(false);

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
    setDetailsId(null);
    setResourcesId(null);
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

  const deleteProduct = async (id, isDeleted) => {
    const confirmMsg = isDeleted
      ? "¿Eliminar este producto DEFINITIVAMENTE? Esta acción no se puede deshacer."
      : "¿Eliminar este producto?";
    if (!confirm(confirmMsg)) return;

    const url = isDeleted
      ? `${API}/admin/products/${id}/permanent`
      : `${API}/admin/products/${id}`;

    const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    if (data.status === "success") {
      if (isDeleted) {
        setProducts((prev) => prev.filter((p) => p.id_product !== id));
      } else {
        setProducts((prev) => prev.map((p) => p.id_product === id ? { ...p, is_deleted: true } : p));
      }
    }
  };

  const startUpload = (id) => { setUploadingId(id); setEditingId(null); setDetailsId(null); setResourcesId(null); setImageFile(null); setImageType("cover"); setUploadSuccess(false); };

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

  const startDetails = (id) => {
    setDetailsId(id);
    setEditingId(null);
    setUploadingId(null);
    setResourcesId(null);
    setNewDetail({ label: "", value: "" });
  };

  const startResources = (id) => {
    setResourcesId(id);
    setEditingId(null);
    setUploadingId(null);
    setDetailsId(null);
    setNewResource({ id_category: "", quantity: 1 });
  };

  const addResource = async (id_product) => {
    if (!newResource.id_category) return;

    setResourceSubmitting(true);

    try {
      const res = await fetch(
        `${API}/admin/products/${id_product}/contents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_category: parseInt(newResource.id_category),
            quantity: parseInt(newResource.quantity) || 1,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setProducts((prev) =>
          prev.map((p) =>
            p.id_product === id_product
              ? {
                ...p,
                productContents: [
                  ...(p.productContents || []),
                  data.data,
                ],
              }
              : p
          )
        );

        setNewResource({
          id_category: "",
          quantity: 1,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResourceSubmitting(false);
    }
  };

  const updateResourceQuantity = async (
    id_product,
    id_product_content,
    quantity
  ) => {
    try {
      const res = await fetch(
        `${API}/admin/product-contents/${id_product_content}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: parseInt(quantity) || 1,
          }),
        }
      );
  
      const data = await res.json();
  
      if (data.status === "success") {
        setProducts((prev) =>
          prev.map((p) =>
            p.id_product === id_product
              ? {
                  ...p,
                  productContents: (p.productContents || []).map((item) =>
                    item.id_product_content === id_product_content
                      ? data.data
                      : item
                  ),
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeResource = async (id_product, id_resource) => {
    const res = await fetch(`${API}/admin/included-resources/${id_resource}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status === "success") {
      setProducts((prev) => prev.map((p) =>
        p.id_product === id_product
          ? { ...p, includedResources: p.includedResources.filter((r) => r.id_resource !== id_resource) }
          : p
      ));
    }
  };

  const addDetail = async (id_product) => {
    if (!newDetail.label.trim() || !newDetail.value.trim()) return;
    setDetailsSubmitting(true);
    try {
      const res = await fetch(`${API}/admin/products/${id_product}/technical-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ label: newDetail.label.trim(), value: newDetail.value.trim() }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setProducts((prev) => prev.map((p) =>
          p.id_product === id_product
            ? { ...p, technicalDetails: [...(p.technicalDetails || []), data.data] }
            : p
        ));
        setNewDetail({ label: "", value: "" });
      }
    } catch (err) {
      console.error("Error al agregar detalle técnico:", err);
    } finally {
      setDetailsSubmitting(false);
    }
  };

  const toggleDetailVisible = async (id_product, detail) => {
    const res = await fetch(`${API}/admin/technical-details/${detail.id_detail}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_visible: !detail.is_visible }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setProducts((prev) => prev.map((p) =>
        p.id_product === id_product
          ? { ...p, technicalDetails: p.technicalDetails.map((d) => d.id_detail === detail.id_detail ? data.data : d) }
          : p
      ));
    }
  };

  const removeDetail = async (id_product, id_detail) => {
    const res = await fetch(`${API}/admin/technical-details/${id_detail}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status === "success") {
      setProducts((prev) => prev.map((p) =>
        p.id_product === id_product
          ? { ...p, technicalDetails: p.technicalDetails.filter((d) => d.id_detail !== id_detail) }
          : p
      ));
    }
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
                <tr className="border-b transition-colors" style={{ borderColor: "var(--color-text-muted)" }}
                  onMouseEnter={e => { if (!p.is_deleted) e.currentTarget.style.background = "var(--color-bg-light)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <td className="py-3 pr-4 font-mono" style={{ color: "var(--color-text-muted)", opacity: p.is_deleted ? 0.3 : 1 }}>{p.id_product}</td>
                  <td className="py-3 pr-4" style={{ color: "var(--color-text)", opacity: p.is_deleted ? 0.3 : 1 }}>
                    {editingId === p.id_product ? (
                      <input className="px-2 py-1 w-full outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-accent)", color: "var(--color-text)" }} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    ) : p.title}
                  </td>
                  <td className="py-3 pr-4" style={{ color: "var(--color-text-muted)", opacity: p.is_deleted ? 0.3 : 1 }}>
                    {editingId === p.id_product ? (
                      <input type="number" className="px-2 py-1 w-24 outline-none" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-accent)", color: "var(--color-text)" }} value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    ) : `$${p.price}`}
                  </td>
                  <td className="py-3 pr-4" style={{ opacity: p.is_deleted ? 0.3 : 1 }}>
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.is_sold ? "var(--color-accent)" : "transparent", color: p.is_sold ? "var(--color-text)" : "var(--color-text-muted)", border: `1px solid ${p.is_sold ? "var(--color-accent)" : "var(--color-text-muted)"}` }}>{p.is_sold ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4" style={{ opacity: p.is_deleted ? 0.3 : 1 }}>
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.visible_in_portfolio ? "var(--color-accent-secondary)" : "transparent", color: p.visible_in_portfolio ? "var(--color-bg-dark)" : "var(--color-text-muted)", border: `1px solid ${p.visible_in_portfolio ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}` }}>{p.visible_in_portfolio ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3 pr-4" style={{ opacity: p.is_deleted ? 0.3 : 1 }}>
                    <span className="px-2 py-1 text-[10px]" style={{ background: p.is_deleted ? "var(--color-accent)" : "transparent", color: p.is_deleted ? "var(--color-text)" : "var(--color-text-muted)", border: `1px solid ${p.is_deleted ? "var(--color-accent)" : "var(--color-text-muted)"}` }}>{p.is_deleted ? "SÍ" : "NO"}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 flex-wrap">
                      {!p.is_deleted && (
                        <>
                          {editingId === p.id_product ? (
                            <>
                              <button onClick={() => saveEdit(p.id_product)} className="px-3 py-1 text-[10px] font-bold transition-colors" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>GUARDAR</button>
                              <button onClick={() => setEditingId(null)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>CANCELAR</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(p)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>EDITAR</button>
                              <button onClick={() => startUpload(p.id_product)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>+ IMG</button>
                              <button onClick={() => startDetails(p.id_product)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>DETALLES</button>
                              <button onClick={() => startResources(p.id_product)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>RECURSOS</button>
                            </>
                          )}
                        </>
                      )}

                      {editingId !== p.id_product && (
                        <button onClick={() => deleteProduct(p.id_product, p.is_deleted)} className="px-3 py-1 text-[10px] transition-colors" style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>✕</button>
                      )}
                    </div>
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

                {detailsId === p.id_product && (
                  <tr key={`details-${p.id_product}`} className="border-b" style={{ borderColor: "var(--color-bg-light)" }}>
                    <td colSpan={7} className="py-4 px-4" style={{ background: "var(--color-bg-light)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4" style={{ background: "var(--color-accent-secondary)" }} />
                        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--color-accent-secondary)" }}>Ficha técnica #{p.id_product}</span>
                        <div className="flex-1 h-px" style={{ background: "var(--color-text-muted)" }} />
                      </div>

                      {(p.technicalDetails || []).length > 0 && (
                        <div className="space-y-2 mb-4">
                          {p.technicalDetails.map((detail) => (
                            <div key={detail.id_detail} className="flex items-center justify-between px-3 py-2" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", opacity: detail.is_visible ? 1 : 0.4 }}>
                              <div className="flex gap-4">
                                <span className="text-[10px] uppercase" style={{ color: "var(--color-text-muted)" }}>{detail.label}</span>
                                <span className="text-[10px]" style={{ color: "var(--color-text)" }}>{detail.value}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleDetailVisible(p.id_product, detail)}
                                  className="text-[10px] uppercase tracking-widest transition-colors"
                                  style={{ color: detail.is_visible ? "var(--color-accent-secondary)" : "var(--color-text-muted)" }}
                                >
                                  {detail.is_visible ? "VISIBLE" : "OCULTO"}
                                </button>
                                <button
                                  onClick={() => removeDetail(p.id_product, detail.id_detail)}
                                  className="text-[10px] transition-colors"
                                  style={{ color: "var(--color-text-muted)" }}
                                  onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
                                  onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-end gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Label</label>
                          <input
                            value={newDetail.label}
                            onChange={(e) => setNewDetail({ ...newDetail, label: e.target.value })}
                            placeholder="Ej: Resolución"
                            className="px-3 py-2 text-xs outline-none"
                            style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Value</label>
                          <input
                            value={newDetail.value}
                            onChange={(e) => setNewDetail({ ...newDetail, value: e.target.value })}
                            placeholder="Ej: 3000x3000px"
                            className="px-3 py-2 text-xs outline-none"
                            style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                          />
                        </div>
                        <button
                          onClick={() => addDetail(p.id_product)}
                          disabled={detailsSubmitting}
                          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 transition-colors"
                          style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
                        >
                          {detailsSubmitting ? "AGREGANDO..." : "+ AGREGAR"}
                        </button>
                        <button
                          onClick={() => setDetailsId(null)}
                          className="px-4 py-2 text-[10px] uppercase tracking-widest transition-colors"
                          style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
                        >
                          CERRAR
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {resourcesId === p.id_product && (
                  <tr key={`resources-${p.id_product}`} className="border-b" style={{ borderColor: "var(--color-bg-light)" }}>
                    <td colSpan={7} className="py-4 px-4" style={{ background: "var(--color-bg-light)" }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4" style={{ background: "var(--color-accent-secondary)" }} />
                        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--color-accent-secondary)" }}>Recursos incluidos #{p.id_product}</span>
                        <div className="flex-1 h-px" style={{ background: "var(--color-text-muted)" }} />
                      </div>

                      {(p.includedResources || []).length > 0 && (
                        <div className="space-y-2 mb-4">
                          {p.includedResources.map((res) => (
                            <div key={res.id_resource} className="flex items-center justify-between px-3 py-2" style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)" }}>
                              <span className="text-[10px] uppercase" style={{ color: "var(--color-text)" }}>{res.category?.name}</span>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  min="1"
                                  defaultValue={res.quantity}
                                  onBlur={(e) => updateResourceQuantity(p.id_product, res.id_resource, e.target.value)}
                                  className="w-14 px-2 py-1 text-[10px] outline-none text-center"
                                  style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                                />
                                <button
                                  onClick={() => removeResource(p.id_product, res.id_resource)}
                                  className="text-[10px] transition-colors"
                                  style={{ color: "var(--color-text-muted)" }}
                                  onMouseEnter={e => e.currentTarget.style.color = "var(--color-accent)"}
                                  onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-end gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Categoría</label>
                          <select
                            value={newResource.id_category}
                            onChange={(e) => setNewResource({ ...newResource, id_category: e.target.value })}
                            className="px-3 py-2 text-xs uppercase tracking-widest outline-none"
                            style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                          >
                            <option value="">-- Seleccionar --</option>
                            {categories.map((c) => (
                              <option key={c.id_category} value={c.id_category}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest block mb-1" style={{ color: "var(--color-text-muted)" }}>Cantidad</label>
                          <input
                            type="number"
                            min="1"
                            value={newResource.quantity}
                            onChange={(e) => setNewResource({ ...newResource, quantity: e.target.value })}
                            className="w-20 px-3 py-2 text-xs outline-none"
                            style={{ background: "var(--color-bg-dark)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                          />
                        </div>
                        <button
                          onClick={() => addResource(p.id_product)}
                          disabled={resourceSubmitting}
                          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 transition-colors"
                          style={{ background: "var(--color-accent)", color: "var(--color-text)" }}
                        >
                          {resourceSubmitting ? "AGREGANDO..." : "+ AGREGAR"}
                        </button>
                        <button
                          onClick={() => setResourcesId(null)}
                          className="px-4 py-2 text-[10px] uppercase tracking-widest transition-colors"
                          style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
                        >
                          CERRAR
                        </button>
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
