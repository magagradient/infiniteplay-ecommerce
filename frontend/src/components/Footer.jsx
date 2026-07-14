export default function Footer() {
  return (
    <footer
      className="w-full py-8 px-16 flex flex-col md:flex-row justify-between items-center gap-2 bg-bg-dark text-text-muted text-xs uppercase tracking-widest border-t border-text-muted/20"
      style={{ fontFamily: "Space Grotesk" }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <span className="font-bold text-xl text-accent-secondary">INFINITE_PLAY</span>
        <span className="opacity-50">©2026 INFINITE_PLAY // SISTEMA_DE_TRANSMISIÓN</span>
      </div>

      <div className="flex gap-8 items-center">
        <a href="#" className="hover:text-accent-secondary hover:line-through transition-all duration-150">TÉRMINOS</a>
        <a href="#" className="hover:text-accent-secondary hover:line-through transition-all duration-150">PRIVACIDAD</a>
        <a href="#" className="hover:text-accent-secondary hover:line-through transition-all duration-150">CONTACTO</a>
      </div>

      <div className="flex gap-4">
        <button className="material-symbols-outlined hover:text-accent-secondary transition-all">rss_feed</button>
        <button className="material-symbols-outlined hover:text-accent-secondary transition-all">terminal</button>
      </div>
    </footer>
  );
}