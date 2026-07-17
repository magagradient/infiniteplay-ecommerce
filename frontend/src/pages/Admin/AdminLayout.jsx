import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>

      {/* Sidebar */}
      <aside className="w-64 flex flex-col py-10 px-6 gap-2 shrink-0" style={{ borderRight: "1px solid var(--color-text-muted)", background: "var(--color-bg-light)" }}>
        <div className="mb-8">
          <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            ADMIN
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tighter" style={{ color: "var(--color-text)" }}>
            INFINITE_<br />PLAY
          </h2>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { to: "/admin/products", label: "// PRODUCTOS" },
            { to: "/admin/create-product", label: "// NUEVO PRODUCTO" },
            { to: "/admin/orders", label: "// ÓRDENES" },
            { to: "/admin/users", label: "// USUARIOS" },
            { to: "/admin/colors", label: "// COLORES" },
            { to: "/admin/keywords", label: "// KEYWORDS" },
            { to: "/admin/series", label: "// SERIES" },
            { to: "/admin/categories", label: "// CATEGORÍAS" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `text-xs uppercase tracking-widest px-3 py-2 border-l-2 transition-colors ${isActive ? "font-bold" : ""}`}
              style={({ isActive }) => ({
                borderLeftColor: isActive ? "var(--color-accent)" : "transparent",
                color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                background: isActive ? "rgba(232,0,77,0.1)" : "transparent",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <p className="text-xs uppercase tracking-widest pt-4" style={{ color: "var(--color-accent-secondary)", borderTop: "1px solid var(--color-text-muted)" }}>
            {user.name}
          </p>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}