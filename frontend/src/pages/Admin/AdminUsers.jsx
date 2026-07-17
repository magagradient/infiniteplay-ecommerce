import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setUsers(data.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest">[CARGANDO...]</p>;

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tighter">
          USUARIOS
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          // <span className="text-accent-secondary">{users.length}</span> USUARIOS REGISTRADOS
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs uppercase tracking-widest border-collapse">
          <thead>
            <tr className="border-b border-text-muted/30 text-text-muted">
              <th className="text-left py-3 pr-4">ID</th>
              <th className="text-left py-3 pr-4">Nombre</th>
              <th className="text-left py-3 pr-4">Email</th>
              <th className="text-left py-3 pr-4">Rol</th>
              <th className="text-left py-3 pr-4">Registrado</th>
              <th className="text-left py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id_user}
                className={`border-b border-text-muted/10 transition-colors ${u.is_deleted ? "opacity-40" : "hover:bg-bg-light"}`}
              >
                <td className="py-3 pr-4 text-text-muted">{u.id_user}</td>
                <td className="py-3 pr-4 text-text-primary">{u.name}</td>
                <td className="py-3 pr-4 text-text-muted">{u.email}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 ${u.role === "admin" ? "bg-bg-light text-accent-secondary" : "bg-bg-light text-text-muted"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 pr-4 text-text-muted">
                  {new Date(u.registration_date).toLocaleDateString("es-AR")}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 ${u.is_deleted ? "bg-accent/20 text-accent" : "bg-bg-light text-accent-secondary"}`}>
                    {u.is_deleted ? "ELIMINADO" : "ACTIVO"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}