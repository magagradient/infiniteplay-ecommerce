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

  const baseClass = "relative text-[var(--color-text)] hover:text-[var(--color-accent)] hover:skew-x-2 hover:bg-[var(--color-accent)]/10 transition-all duration-75 uppercase px-2 py-1 text-label-sm";
  const activeClass = "text-[var(--color-accent)] border-b border-[var(--color-accent)] pb-1";
  const linkStyle = { fontFamily: "Space Grotesk" };

  const renderLink = (to, label, end = false) => (
    <NavLink
      to={to}
      end={end}
      style={linkStyle}
      className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ background: "var(--color-accent-secondary)" }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div
      className={`fixed top-16 left-0 w-full h-12 z-40 transition-colors duration-300 ${scrolled ? "bg-[var(--color-bg-light)]" : "bg-transparent"
        }`}
    >
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-center gap-8">

        {renderLink("/", "Home", true)}
        {renderLink("/shop", "Shop")}
        {renderLink("/products", "Products")}
        {renderLink("/sold", "Sold")}
        {renderLink("/about", "About")}
        {renderLink("/contact", "Contact")}
        {renderLink("/lab", "Lab")}

        {user?.role === "admin" && (
          <NavLink
            to="/admin/products"
            style={linkStyle}
            className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""} border border-[var(--color-accent-secondary)]/50 px-3`}
          >
            Admin
          </NavLink>
        )}

      </div>
    </div>
  );
}