import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(data.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const statusColor = (status) => {
    if (status === "paid") return "bg-bg-light text-accent-secondary";
    if (status === "pending") return "bg-bg-light text-text-muted";
    return "bg-accent/20 text-accent";
  };

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest">[CARGANDO...]</p>;

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tighter">
          ORDENES
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{orders.length}</span> ORDENES EN TOTAL
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {orders.map((o) => (
          <div key={o.id_order} className="border border-text-muted/30 hover:border-accent-secondary/50 transition-colors">

            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => setExpanded(expanded === o.id_order ? null : o.id_order)}
            >
              <div className="flex items-center gap-6">
                <span className="text-text-muted text-xs uppercase tracking-widest w-8">
                  #{o.id_order}
                </span>
                <span className="text-text-primary text-xs uppercase tracking-widest">
                  {o.user?.name || "--"}
                </span>
                <span className="text-text-muted text-xs">
                  {new Date(o.order_date).toLocaleDateString("es-AR")}
                </span>
                <span className="text-text-muted text-xs">
                  ${o.total}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs uppercase tracking-widest ${statusColor(o.status)}`}>
                  {o.status}
                </span>
                <span className="text-text-muted text-xs">
                  {expanded === o.id_order ? "A" : "V"}
                </span>
              </div>
            </div>

            {expanded === o.id_order && (
              <div className="border-t border-text-muted/30 px-4 py-4 bg-bg-light">
                <p className="text-text-muted text-xs uppercase tracking-widest mb-3">
                  // EMAIL: {o.user?.email}
                </p>
                <table className="w-full text-xs uppercase tracking-widest">
                  <thead>
                    <tr className="text-text-muted border-b border-text-muted/30">
                      <th className="text-left py-2 pr-4">Producto</th>
                      <th className="text-left py-2 pr-4">Precio</th>
                      <th className="text-left py-2 pr-4">Artista</th>
                      <th className="text-left py-2">Musica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.orderedProducts?.map((p) => (
                      <tr key={p.id_product} className="border-b border-text-muted/10">
                        <td className="py-2 pr-4 text-text-primary">{p.title}</td>
                        <td className="py-2 pr-4 text-text-muted">${p.OrdersProducts?.unit_price}</td>
                        <td className="py-2 pr-4 text-text-muted">
                          {p.OrdersProducts?.artist_name || <span className="text-text-muted/50">--</span>}
                        </td>
                        <td className="py-2 text-text-muted">
                          {p.OrdersProducts?.music_url ? (
                            <a href={p.OrdersProducts.music_url} target="_blank" rel="noreferrer" className="text-accent-secondary hover:underline">ABRIR</a>
                          ) : (
                            <span className="text-text-muted/50">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}