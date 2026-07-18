import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import ProductCard from "../../components/ProductCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  if (!favorites) return (
    <p className="text-text-muted text-xs uppercase tracking-widest p-16">[CARGANDO...]</p>
  );

  return (
    <section className="min-h-screen bg-bg-dark px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="mb-10">
        <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
          CUENTA
        </div>
        <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none mb-2">
          MIS_FAVORITOS
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-text-muted text-xs uppercase tracking-widest border-l border-accent pl-4">
            // {favorites.length} OBRA{favorites.length !== 1 ? "S" : ""} GUARDADA{favorites.length !== 1 ? "S" : ""}
          </p>
          <span className="px-2 py-1 bg-bg-light text-accent-secondary text-xs uppercase tracking-widest">
            ♥ {favorites.length}
          </span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="border border-text-muted/30 p-8 text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-4">[LISTA_VACÍA] // NO TENÉS FAVORITOS TODAVÍA</p>
          <Link to="/shop" className="text-accent-secondary text-xs uppercase tracking-widest hover:text-text-primary transition-colors">
            → IR_A_LA_TIENDA
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id_product} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}