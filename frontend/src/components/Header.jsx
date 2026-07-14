import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { favorites } = useFavorites();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "The Lab", path: "/lab" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header className="bg-bg-dark text-text-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide">
                    Infinite<span className="text-accent">Play</span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `hover:text-accent-hover transition ${
                                    isActive ? "text-accent-hover" : ""
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Right icons */}
                <div className="flex items-center space-x-5">

                    <NavLink to="/search" className="hover:text-accent-hover transition">
                        <Search size={20} />
                    </NavLink>

                    {/* ❤️ Favorites */}
                    <NavLink
                        to="/account/favorites"
                        className="relative hover:text-accent-hover transition"
                    >
                        <Heart size={20} />

                        {favorites.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent-secondary text-bg-dark text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                                {favorites.length}
                            </span>
                        )}
                    </NavLink>

                    <NavLink to="/cart" className="hover:text-accent-hover transition">
                        <ShoppingCart size={20} />
                    </NavLink>

                    <NavLink to="/account/profile" className="hover:text-accent-hover transition">
                        <User size={20} />
                    </NavLink>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden hover:text-accent-hover"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-bg-dark border-t border-text-muted/20">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-bg-light"
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    <div className="border-t border-text-muted/20 mt-2">
                        <NavLink
                            to="/account/profile"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-bg-light"
                        >
                            Account
                        </NavLink>

                        <NavLink
                            to="/account/favorites"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-bg-light"
                        >
                            Favorites
                        </NavLink>

                        <NavLink
                            to="/search"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-bg-light"
                        >
                            Search
                        </NavLink>

                        <NavLink
                            to="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-bg-light"
                        >
                            Cart
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;