import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#141218] flex" style={{ fontFamily: "Space Grotesk" }}>

      {/* Sidebar */}
      <aside className="w-64 border-r border-[#494551] flex flex-col py-10 px-6 gap-2 shrink-0">
        <div className="mb-8">
          <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.4em] mb-3">
            ADMIN
          </div>
          <h2 className="text-[#e6e0e9] text-xl font-bold uppercase tracking-tighter">
            MAGALAB_<br />PANEL
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
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest px-3 py-2 border-l-2 transition-colors ${isActive
                  ? "border-[#ffb4ab] text-[#ffb4ab] bg-[#381e72]/20"
                  : "border-transparent text-[#494551] hover:text-[#cbc4d2] hover:border-[#494551]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <p className="text-[#494551] text-xs uppercase tracking-widest border-t border-[#494551] pt-4">
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