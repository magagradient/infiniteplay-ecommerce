import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageType, setImageType] = useState("cover");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProducts(data.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const startEdit = (product) => {
    setEditingId(product.id_product);
    setUploadingId(null);
    setEditForm({
      title: product.title,
      price: product.price,
      description: product.description || "",
      is_sold: product.is_sold,
      visible_in_portfolio: product.visible_in_portfolio,
    });
  };

  const saveEdit = async (id) => {
    const res = await fetch(`${API}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (data.status === "success") {
      setProducts((prev) =>
        prev.map((p) => (p.id_product === id ? { ...p, ...editForm } : p))
      );
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
        setTimeout(() => {
          setUploadingId(null);
          setUploadSuccess(false);
          setImageFile(null);
        }, 1500);
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setUploadLoading(false);
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
          PRODUCTOS
        </h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest mt-1">
          // {products.length} PRODUCTOS EN TOTAL
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs uppercase tracking-widest border-collapse">
          <thead>
            <tr className="border-b border-[#494551] text-[#494551]">
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
              <>
                <tr
                  key={p.id_product}
                  className={`border-b border-[#494551]/40 transition-colors ${p.is_deleted ? "opacity-40" : "hover:bg-[#1d1b20]"
                    }`}
                >
                  <td className="py-3 pr-4 text-[#494551]">{p.id_product}</td>

                  <td className="py-3 pr-4 text-[#e6e0e9]">
                    {editingId === p.id_product ? (
                      <input
                        className="bg-[#1d1b20] border border-[#ffb4ab] text-[#e6e0e9] px-2 py-1 w-full"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      p.title
                    )}
                  </td>

                  <td className="py-3 pr-4 text-[#cbc4d2]">
                    {editingId === p.id_product ? (
                      <input
                        type="number"
                        className="bg-[#1d1b20] border border-[#ffb4ab] text-[#e6e0e9] px-2 py-1 w-24"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    ) : (
                      `$${p.price}`
                    )}
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 ${p.is_sold ? "bg-[#381e72] text-[#ffb4ab]" : "bg-[#1d1b20] text-[#494551]"}`}>
                      {p.is_sold ? "SÍ" : "NO"}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 ${p.visible_in_portfolio ? "bg-[#1d1b20] text-[#cbc4d2]" : "bg-[#1d1b20] text-[#494551]"}`}>
                      {p.visible_in_portfolio ? "SÍ" : "NO"}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 ${p.is_deleted ? "bg-[#690005] text-[#ffb4ab]" : "bg-[#1d1b20] text-[#494551]"}`}>
                      {p.is_deleted ? "SÍ" : "NO"}
                    </span>
                  </td>

                  <td className="py-3">
                    {!p.is_deleted && (
                      <div className="flex gap-2 flex-wrap">
                        {editingId === p.id_product ? (
                          <>
                            <button onClick={() => saveEdit(p.id_product)}
                              className="px-3 py-1 bg-[#ffb4ab] text-[#690005] hover:opacity-80 transition-opacity">
                              GUARDAR
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="px-3 py-1 border border-[#494551] text-[#494551] hover:border-[#cbc4d2] hover:text-[#cbc4d2] transition-colors">
                              CANCELAR
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(p)}
                              className="px-3 py-1 border border-[#494551] text-[#cbc4d2] hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-colors">
                              EDITAR
                            </button>
                            <button onClick={() => startUpload(p.id_product)}
                              className="px-3 py-1 border border-[#494551] text-[#cbc4d2] hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-colors">
                              + IMAGEN
                            </button>
                            <button onClick={() => deleteProduct(p.id_product)}
                              className="px-3 py-1 border border-[#494551] text-[#494551] hover:border-[#690005] hover:text-[#690005] transition-colors">
                              ELIMINAR
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>

                {uploadingId === p.id_product && (
                  <tr key={`upload-${p.id_product}`} className="border-b border-[#494551]/40">
                    <td colSpan={7} className="py-4 px-4 bg-[#1d1b20]">
                      <div className="flex flex-wrap items-center gap-4">
                        <select
                          value={imageType}
                          onChange={e => setImageType(e.target.value)}
                          className="bg-[#141218] border border-[#494551] text-[#e6e0e9] px-3 py-2 text-xs uppercase tracking-widest focus:border-[#ffb4ab] outline-none"
                        >
                          <option value="cover">COVER</option>
                          <option value="banner">BANNER</option>
                        </select>

                        <label className="px-4 py-2 border border-[#494551] text-[#cbc4d2] text-xs uppercase tracking-widest hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-colors cursor-pointer">
                          {imageFile ? imageFile.name.substring(0, 20) + "..." : "ELEGIR ARCHIVO"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                            className="hidden"
                          />
                        </label>

                        {uploadSuccess ? (
                          <span className="text-[#ffb4ab] text-xs uppercase tracking-widest">✓ IMAGEN SUBIDA</span>
                        ) : (
                          <button
                            onClick={() => handleUpload(p.id_product)}
                            disabled={!imageFile || uploadLoading}
                            className="px-4 py-2 bg-[#ffb4ab] text-[#690005] text-xs font-bold uppercase tracking-widest hover:opacity-80 disabled:opacity-40 transition-opacity"
                          >
                            {uploadLoading ? "SUBIENDO..." : "SUBIR"}
                          </button>
                        )}

                        <button
                          onClick={() => setUploadingId(null)}
                          className="px-3 py-2 border border-[#494551] text-[#494551] text-xs uppercase tracking-widest hover:border-[#cbc4d2] hover:text-[#cbc4d2] transition-colors"
                        >
                          CANCELAR
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}