import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useLocation } from "../context/LocationContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onCardClick }) {
  const { isFavorite, add, remove } = useFavorites();
  const { toggleCart, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useLocation();

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [];
  const coverImage = images.find(img => img.image_type === "cover") || images[0] || null;
  const hoverImage = images.find(img => img.image_type !== "cover" && img.id_image !== coverImage?.id_image) || null;
  const coverSrc = coverImage?.image_url || `https://picsum.photos/500/500?random=${product.id_product}`;
  const hoverSrc = hoverImage?.image_url || null;
  const fav = isFavorite(product.id_product);

  const toggleFavorite = () => {
    if (fav) remove(product.id_product);
    else add(product);
  };

  const imageBlock = (
    <div
      className="aspect-square relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={coverSrc}
        alt={product.title || "producto"}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isHovered && hoverSrc ? "opacity-0" : "opacity-100"}`}
      />
      {hoverSrc && (
        <img
          src={hoverSrc}
          alt={product.title || "producto"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute top-4 left-4 text-xs px-2 py-1 backdrop-blur-sm border uppercase tracking-widest"
        style={{ background: "var(--color-bg-dark)", color: "var(--color-accent)", borderColor: "var(--color-accent)" }}>
        {product.id_product?.toString().padStart(2, "0")}_{product.title?.split(" ")[0]?.toUpperCase()}
      </div>

      {/* Corner tick en cian, aparece solo en hover */}
      <div
        className={`absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={{ borderColor: "var(--color-accent-secondary)" }}
      />
    </div>
  );

  return (
    <div
      className="group relative overflow-hidden transition-colors border"
      style={{ background: "var(--color-bg-light)", borderColor: "var(--color-text-muted)", fontFamily: "Space Grotesk" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-accent)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-text-muted)"}
    >
      {onCardClick ? (
        <div onClick={() => onCardClick(product)} className="cursor-pointer">
          {imageBlock}
        </div>
      ) : (
        <Link to={`/products/${product.id_product}`}>
          {imageBlock}
        </Link>
      )}

      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold uppercase tracking-tight text-sm mb-1" style={{ color: "var(--color-text)" }}>
            {product.title || "Producto sin nombre"}
          </h3>
          <p className="text-xs uppercase" style={{ color: "var(--color-text-muted)" }}>
            {formatPrice(product.price || 0)} <span style={{ color: "var(--color-accent-secondary)" }}>// LIC_BASIC</span>
          </p>
          {onCardClick && (
            <button
              onClick={(e) => { e.preventDefault(); onCardClick(product); }}
              className="text-xs uppercase tracking-widest transition-colors mt-1"
              style={{ color: "var(--color-accent-secondary)" }}
            >
              VER_ARTISTA
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            className="w-10 h-10 border flex items-center justify-center transition-all"
            style={{
              background: fav ? "var(--color-accent)" : "transparent",
              borderColor: fav ? "var(--color-accent)" : "var(--color-text-muted)",
              color: "var(--color-text)",
            }}
          >
            ♥
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product.id_product); }}
            className="w-10 h-10 flex items-center justify-center transition-all border"
            style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "var(--color-text)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-text)"; }}
          >
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}