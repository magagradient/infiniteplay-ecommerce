import { NavLink } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseClass = "text-[#ffb4ab] hover:text-error hover:skew-x-2 hover:bg-[#ffb4ab]/10 transition-all duration-75 uppercase px-2 py-1 text-label-sm";
  const activeClass = "text-error border-b border-error pb-1";
  const linkStyle = { fontFamily: "Space Grotesk" };

  return (
    <div className={`fixed top-16 left-0 w-full h-12 z-40 transition-colors duration-300 ${scrolled ? "bg-[#381e72] border-none" : "bg-transparent border-none"}`}>
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-center gap-8">

        <NavLink to="/" end style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>Home</NavLink>
        <NavLink to="/shop" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>Shop</NavLink>
        <NavLink to="/products" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>Products</NavLink>
        <NavLink to="/sold" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>Sold</NavLink>
        <NavLink to="/about" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>About</NavLink>
        <NavLink to="/contact" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}>Contact</NavLink>

        {user?.role === "admin" && (
          <NavLink to="/admin/products" style={linkStyle} className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""} border border-[#ffb4ab]/40 px-3`}>
            Admin
          </NavLink>
        )}

      </div>
    </div>
  );
}