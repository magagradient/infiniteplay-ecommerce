import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function TopBar() {
  const { favorites } = useFavorites();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!searchTerm.trim()) return;
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-16 z-50 transition-colors duration-300 ${scrolled ? "bg-[var(--color-bg-light)]" : "bg-transparent"
        }`}
    >
      <div className="h-full grid grid-cols-3 items-center px-10">
        {/* Logo */}
        <div className="flex items-center justify-start">
          <Link to="/" style={{ fontFamily: "Space Grotesk", letterSpacing: "-0.05em", color: "var(--color-accent)" }} className="text-2xl font-bold hover:opacity-80 transition-opacity">
            INFINITE_PLAY
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 text-sm border focus:outline-none transition-colors duration-150"
              style={{
                background: "var(--color-bg-light)",
                color: "var(--color-text)",
                borderColor: "var(--color-text-muted)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent-secondary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-text-muted)")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-150"
              style={{ color: searchTerm ? "var(--color-accent-secondary)" : "var(--color-text-muted)" }}
            />
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center justify-end gap-3">

          <Link to="/account/favorites" className="relative group">
            <Heart className="w-5 h-5 transition-colors duration-75" style={{ color: "var(--color-text-muted)" }} />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
                {favorites.length}
              </span>
            )}
          </Link>

          <button onClick={toggleCart} className="group">
            <ShoppingCart className="w-5 h-5 transition-colors duration-75" style={{ color: "var(--color-text-muted)" }} />
          </button>

          <Link to={user ? "/account/profile" : "/account/login"} className="group">
            <User className="w-5 h-5 transition-colors duration-75" style={{ color: "var(--color-text-muted)" }} />
          </Link>

        </div>
      </div>
    </div>
  );
}