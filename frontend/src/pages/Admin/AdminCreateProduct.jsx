import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const API = import.meta.env.VITE_API_URL;

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: "#1d1b20",
    borderColor: state.isFocused ? "#ffb4ab" : "#494551",
    borderRadius: 0,
    boxShadow: "none",
    "&:hover": { borderColor: "#ffb4ab" },
    fontFamily: "Space Grotesk",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  }),
  menu: (base) => ({
    ...base,
    background: "#1d1b20",
    border: "1px solid #494551",
    borderRadius: 0,
    zIndex: 99,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "#381e72" : state.isFocused ? "#141218" : "#1d1b20",
    color: state.isSelected ? "#ffb4ab" : "#cbc4d2",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#e6e0e9",
    fontSize: "12px",
    textTransform: "uppercase",
  }),
  multiValue: (base) => ({
    ...base,
    background: "#381e72",
    borderRadius: 0,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#ffb4ab",
    fontSize: "11px",
    textTransform: "uppercase",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#ffb4ab",
    "&:hover": { background: "#690005", color: "#fff" },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#494551",
    fontSize: "12px",
    textTransform: "uppercase",
  }),
  input: (base) => ({
    ...base,
    color: "#e6e0e9",
    fontSize: "12px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#494551",
    "&:hover": { color: "#ffb4ab" },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#494551",
    "&:hover": { color: "#ffb4ab" },
  }),
};

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
    price: "",
    id_category: "",
    id_series: "",
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          id_category: parseInt(form.id_category),
          id_series: form.id_series ? parseInt(form.id_series) : null,
        }),
      });

      const data = await res.json();
      console.log("RESPUESTA CREATE:", data);


      if (!res.ok) {
        setError(data.description || data.message || "Error al crear producto");
        setLoading(false);
        return;
      }

      const newProductId = data.data?.id_product;
      console.log("NEW PRODUCT ID:", newProductId);

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

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-[#e6e0e9] text-3xl font-bold uppercase tracking-tighter">
          NUEVO_PRODUCTO
        </h1>
      </div>

      <div className="max-w-xl space-y-5">

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Título *</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-sm focus:border-[#ffb4ab] outline-none"
            placeholder="CIRCUITS-004" />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Descripción corta</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2}
            className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-sm focus:border-[#ffb4ab] outline-none resize-none"
            placeholder="Cover art + Banner" />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Descripción larga</label>
          <textarea name="description_long" value={form.description_long} onChange={handleChange} rows={5}
            className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-sm focus:border-[#ffb4ab] outline-none resize-none"
            placeholder="Descripción detallada del producto, concepto, técnica utilizada..." />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Precio (USD) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange}
            className="w-full bg-[#1d1b20] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-sm focus:border-[#ffb4ab] outline-none"
            placeholder="15.00" />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Categoría *</label>
          <Select
            options={categories.map(c => ({ value: c.id_category, label: c.name }))}
            onChange={opt => setForm({ ...form, id_category: opt ? opt.value : "" })}
            placeholder="-- Seleccionar --"
            isClearable
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Serie</label>
          <Select
            options={seriesList.map(s => ({ value: s.id_series, label: s.title }))}
            onChange={opt => setForm({ ...form, id_series: opt ? opt.value : "" })}
            placeholder="-- Sin serie --"
            isClearable
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Colores</label>
          <Select
            isMulti
            options={colorsList.map(c => ({ value: c.id_color, label: c.name }))}
            onChange={setSelectedColors}
            value={selectedColors}
            placeholder="-- Seleccionar colores --"
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Keywords</label>
          <Select
            isMulti
            options={keywordsList.map(k => ({ value: k.id_keyword, label: k.name }))}
            onChange={setSelectedKeywords}
            value={selectedKeywords}
            placeholder="-- Seleccionar keywords --"
            styles={selectStyles}
          />
        </div>

        <div>
          <label className="text-[#494551] text-xs uppercase tracking-widest block mb-1">Imagen (cover)</label>
          <label className="w-full px-4 py-2 border border-[#494551] text-[#cbc4d2] text-xs uppercase tracking-widest hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-colors cursor-pointer block">
            {imageFile ? imageFile.name.substring(0, 30) + "..." : "ELEGIR ARCHIVO"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="mt-3 w-40 h-40 object-cover border border-[#494551]" />
          )}
        </div>

        {error && (
          <p className="text-[#690005] text-xs uppercase tracking-widest border border-[#690005] px-3 py-2">{error}</p>
        )}

        {success && (
          <p className="text-[#ffb4ab] text-xs uppercase tracking-widest border border-[#ffb4ab] px-3 py-2">PRODUCTO CREADO — REDIRIGIENDO...</p>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 bg-[#ffb4ab] text-[#690005] text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40">
            {loading ? "CREANDO..." : "CREAR PRODUCTO"}
          </button>
          <button onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border border-[#494551] text-[#494551] text-xs uppercase tracking-widest hover:border-[#cbc4d2] hover:text-[#cbc4d2] transition-colors">
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}