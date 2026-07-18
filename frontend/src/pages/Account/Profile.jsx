import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <section className="min-h-screen bg-bg-dark flex items-center justify-center px-4" style={{ fontFamily: "Space Grotesk" }}>
      <div className="w-full max-w-md border border-text-muted/30 p-8">

        <div className="mb-8">
          <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
            USUARIO_ACTIVO
          </div>
          <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none">
            MI_PERFIL
          </h1>
        </div>

        {user && (
          <>
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-20 h-20 rounded-full mb-6 border border-text-muted/30"
              />
            )}

            <div className="space-y-3 mb-8">
              <div className="border border-text-muted/30 px-4 py-3">
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">NOMBRE</p>
                <p className="text-text-primary text-sm">{user.name}</p>
              </div>
              <div className="border border-text-muted/30 px-4 py-3">
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">EMAIL</p>
                <p className="text-text-primary text-sm">{user.email}</p>
              </div>
              <div className="border border-text-muted/30 px-4 py-3">
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">ROL</p>
                <p className="text-text-primary text-sm uppercase">{user.role}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs uppercase tracking-widest">
              <Link to="/account/favorites" className="block text-text-muted hover:text-accent-secondary transition-colors">
                → MIS_FAVORITOS
              </Link>
              <Link to="/account/my-purchases" className="block text-text-muted hover:text-accent-secondary transition-colors">
                → MIS_COMPRAS
              </Link>
              <Link to="/account/change-password" className="block text-text-muted hover:text-accent-secondary transition-colors">
                → CAMBIAR_CONTRASEÑA
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="block text-accent hover:text-text-primary transition-colors mt-4"
              >
                → CERRAR_SESIÓN
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
}