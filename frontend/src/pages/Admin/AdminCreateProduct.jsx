import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: "var(--color-bg-light)",
    borderColor: state.isFocused ? "var(--color-accent-secondary)" : "var(--color-text-muted)",
    borderRadius: 0,
    boxShadow: "none",
    "&:hover": { borderColor: "var(--color-accent-secondary)" },
    fontFamily: "Space Grotesk",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  }),
  menu: (base) => ({
    ...base,
    background: "var(--color-bg-light)",
    border: "1px solid var(--color-text-muted)",
    borderRadius: 0,
    zIndex: 99,
  }),
  menuList: (base) => ({ ...base, padding: 0 }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "var(--color-accent)" : state.isFocused ? "var(--color-bg-dark)" : "var(--color-bg-light)",
    color: state.isSelected ? "var(--color-text)" : "var(--color-text-muted)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "var(--color-text)", fontSize: "12px", textTransform: "uppercase" }),
  multiValue: (base) => ({ ...base, background: "var(--color-accent-secondary)", borderRadius: 0 }),
  multiValueLabel: (base) => ({ ...base, color: "var(--color-bg-dark)", fontSize: "11px", textTransform: "uppercase" }),
  multiValueRemove: (base) => ({ ...base, color: "var(--color-bg-dark)", "&:hover": { background: "var(--color-accent-hover)", color: "var(--color-text)" } }),
  placeholder: (base) => ({ ...base, color: "var(--color-text-muted)", fontSize: "12px", textTransform: "uppercase" }),
  input: (base) => ({ ...base, color: "var(--color-text)", fontSize: "12px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "var(--color-text-muted)", "&:hover": { color: "var(--color-accent-secondary)" } }),
  clearIndicator: (base) => ({ ...base, color: "var(--color-text-muted)", "&:hover": { color: "var(--color-accent-secondary)" } }),
};

const CUSTOMIZATION_OPTIONS = [
  { value: "title", label: "Título" },
  { value: "artist", label: "Nombre de artista" },
  { value: "date", label: "Fecha y hora del evento" },
  { value: "location", label: "Lugar del evento" },
];

export default function AdminCreateProduct() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    description_long: "",
    price: "",
    id_category: "",
    id_series: "",
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customizationFields, setCustomizationFields] = useState([]);

  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(d => setCategories(d.data || []));
    fetch(`${API}/series`).then(r => r.json()).then(d => setSeriesList(d.data || []));
    fetch(`${API}/colors`).then(r => r.json()).then(d => setColorsList(d.data || []));
    fetch(`${API}/keywords`).then(r => r.json()).then(d => setKeywordsList(d.data || []));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const assignRelation = async (productId, relationType, ids) => {
    if (!ids.length) return;
    await fetch(`${API}/products/${productId}/assign/${relationType}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids }),
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          id_category: parseInt(form.id_category),
          id_series: form.id_series ? parseInt(form.id_series) : null,
          is_customizable: isCustomizable,
          customization_fields: isCustomizable ? customizationFields.map(f => f.value) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.description || data.message || "Error al crear producto"); setLoading(false); return; }
      const newProductId = data.data?.id_product;
      if (imageFile && newProductId) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("type", "cover");
        await fetch(`${API}/products/${newProductId}/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      await assignRelation(newProductId, "colors", selectedColors.map(c => c.value));
      await assignRelation(newProductId, "keywords", selectedKeywords.map(k => k.value));
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: "var(--color-text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" };
  const inputStyle = {
    width: "100%",
    background: "var(--color-bg-light)",
    border: "1px solid var(--color-text-muted)",
    color: "var(--color-text)",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
          ADMIN
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>
          NUEVO_PRODUCTO
        </h1>
        <div className="w-12 h-[2px] mt-2" style={{ background: "var(--color-accent-secondary)" }}></div>
      </div>

      <div className="max-w-xl space-y-5">
        <div>
          <label style={labelStyle}>Título *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="CIRCUITS-004"
            style={inputStyle} onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
        </div>

        <div>
          <label style={labelStyle}>Descripción corta</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Cover art + Banner"
            style={{ ...inputStyle, resize: "none" }} onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
        </div>

        <div>
          <label style={labelStyle}>Descripción larga</label>
          <textarea name="description_long" value={form.description_long} onChange={handleChange} rows={5} placeholder="Descripción detallada..."
            style={{ ...inputStyle, resize: "none" }} onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
        </div>

        <div>
          <label style={labelStyle}>Precio (USD) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="15.00"
            style={inputStyle} onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"} onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
        </div>

        <div>
          <label style={labelStyle}>Categoría *</label>
          <Select options={categories.map(c => ({ value: c.id_category, label: c.name }))} onChange={opt => setForm({ ...form, id_category: opt ? opt.value : "" })} placeholder="-- Seleccionar --" isClearable styles={selectStyles} />
        </div>

        <div>
          <label style={labelStyle}>Serie</label>
          <Select options={seriesList.map(s => ({ value: s.id_series, label: s.title }))} onChange={opt => setForm({ ...form, id_series: opt ? opt.value : "" })} placeholder="-- Sin serie --" isClearable styles={selectStyles} />
        </div>

        <div>
          <label style={labelStyle}>Colores</label>
          <Select isMulti options={colorsList.map(c => ({ value: c.id_color, label: c.name }))} onChange={setSelectedColors} value={selectedColors} placeholder="-- Seleccionar colores --" styles={selectStyles} />
        </div>

        <div>
          <label style={labelStyle}>Keywords</label>
          <Select isMulti options={keywordsList.map(k => ({ value: k.id_keyword, label: k.name }))} onChange={setSelectedKeywords} value={selectedKeywords} placeholder="-- Seleccionar keywords --" styles={selectStyles} />
        </div>

        {/* --- Personalización --- */}
        <div className="pt-2" style={{ borderTop: "1px solid var(--color-text-muted)" }}>
          <label className="flex items-center gap-2 cursor-pointer mb-4 mt-4">
            <input
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => {
                setIsCustomizable(e.target.checked);
                if (!e.target.checked) setCustomizationFields([]);
              }}
              className="w-4 h-4"
              style={{ accentColor: "var(--color-accent-secondary)" }}
            />
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text)" }}>
              Producto personalizado a pedido (no es descarga inmediata)
            </span>
          </label>

          {isCustomizable && (
            <div>
              <label style={labelStyle}>Datos a pedirle al comprador</label>
              <Select
                isMulti
                options={CUSTOMIZATION_OPTIONS}
                value={customizationFields}
                onChange={setCustomizationFields}
                placeholder="-- Seleccionar campos --"
                styles={selectStyles}
              />
              <p className="text-[10px] uppercase tracking-widest mt-2" style={{ color: "var(--color-accent-secondary)" }}>
                Si no seleccionás nada, se pedirá título y artista por defecto.
              </p>
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Imagen (cover)</label>
          <label className="w-full px-4 py-2 text-xs uppercase tracking-widest transition-colors cursor-pointer block"
            style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>
            {imageFile ? imageFile.name.substring(0, 30) + "..." : "ELEGIR ARCHIVO"}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {imagePreview && <img src={imagePreview} alt="preview" className="mt-3 w-40 h-40 object-cover" style={{ border: "1px solid var(--color-accent-secondary)" }} />}
        </div>

        {error && <p className="text-xs uppercase tracking-widest px-3 py-2" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}>{error}</p>}
        {success && <p className="text-xs uppercase tracking-widest px-3 py-2" style={{ color: "var(--color-accent-secondary)", border: "1px solid var(--color-accent-secondary)" }}>PRODUCTO CREADO — REDIRIGIENDO...</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-40"
            style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            {loading ? "CREANDO..." : "CREAR PRODUCTO"}
          </button>
          <button onClick={() => navigate("/admin/products")}
            className="px-6 py-2 text-xs uppercase tracking-widest transition-colors"
            style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
