import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getMyPurchases } from "../../services/api";

const API = import.meta.env.VITE_API_URL;

export default function MyPurchases() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ artist_name: "", artist_bio: "", music_url: "" });

  useEffect(() => {
    if (!token) return;
    getMyPurchases(token)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleEdit = (id_order, id_product, current) => {
    setEditing({ id_order, id_product });
    setForm({
      artist_name: current.artist_name || "",
      artist_bio: current.artist_bio || "",
      music_url: current.music_url || "",
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/orders_products/${editing.id_order}/${editing.id_product}/credit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setEditing(null);
      const data = await getMyPurchases(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest p-16">[CARGANDO...]</p>;

  return (
    <section className="min-h-screen bg-bg-dark px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
            CUENTA
          </div>
          <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none">
            MIS_COMPRAS
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="border border-text-muted/30 p-8 text-center">
            <p className="text-text-muted text-xs uppercase tracking-widest">[LISTA_VACÍA] // NO TENÉS COMPRAS TODAVÍA</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id_order} className="border border-text-muted/30 mb-6">
              <div className="border-b border-text-muted/30 px-6 py-3 flex justify-between items-center">
                <span className="text-text-muted text-xs uppercase tracking-widest">ORDEN #{order.id_order}</span>
                <span className="text-text-muted text-xs uppercase">{new Date(order.order_date).toLocaleDateString()}</span>
              </div>

              {order.orderDetails?.map(item => (
                <div key={item.id_product} className="px-6 py-4 border-b border-text-muted/30">
                  <div className="flex gap-4 items-start">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0].image_url} alt={item.product.title} className="w-16 h-16 object-cover border border-text-muted/30" />
                    )}
                    <div className="flex-1">
                      <p className="text-text-primary text-sm uppercase font-bold mb-2">{item.product?.title}</p>

                      {editing?.id_order === order.id_order && editing?.id_product === item.id_product ? (
                        <div className="space-y-2 mt-2">
                          <input
                            placeholder="Nombre artístico"
                            value={form.artist_name}
                            onChange={e => setForm({ ...form, artist_name: e.target.value })}
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-3 py-2 text-xs focus:outline-none focus:border-accent-secondary"
                          />
                          <textarea
                            placeholder="Mini bio"
                            value={form.artist_bio}
                            onChange={e => setForm({ ...form, artist_bio: e.target.value })}
                            rows={2}
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-3 py-2 text-xs focus:outline-none focus:border-accent-secondary resize-none"
                          />
                          <input
                            placeholder="Link a tu música"
                            value={form.music_url}
                            onChange={e => setForm({ ...form, music_url: e.target.value })}
                            className="w-full bg-bg-light border border-text-muted/30 text-text-primary px-3 py-2 text-xs focus:outline-none focus:border-accent-secondary"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleSave} className="px-4 py-2 bg-accent text-bg-dark text-xs uppercase font-bold hover:bg-transparent hover:border hover:border-accent hover:text-accent transition-all">
                              GUARDAR
                            </button>
                            <button onClick={() => setEditing(null)} className="px-4 py-2 border border-text-muted/30 text-text-muted text-xs uppercase hover:border-accent-secondary hover:text-accent-secondary transition-all">
                              CANCELAR
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {item.artist_name && <p className="text-text-muted text-xs uppercase">// {item.artist_name}</p>}
                          {item.artist_bio && <p className="text-text-muted/70 text-xs mt-1">{item.artist_bio}</p>}
                          {item.music_url && <a href={item.music_url} target="_blank" rel="noreferrer" className="text-accent-secondary text-xs uppercase hover:text-text-primary transition-colors">→ ESCUCHAR</a>}
                          <button
                            onClick={() => handleEdit(order.id_order, item.id_product, item)}
                            className="block mt-2 text-text-muted text-xs uppercase hover:text-accent-secondary transition-colors"
                          >
                            → EDITAR_CRÉDITO
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

      </div>
    </section>
  );
}