export default function TextPropertiesPanel({ element, onChange, onOpenFontPicker }) {
  const toggleStyle = (style) => {
    const current = element.fontStyle || "normal";
    const has = (s) => current.includes(s);
    let next;
    if (style === "bold") next = has("italic") ? (has("bold") ? "italic" : "italic bold") : (has("bold") ? "normal" : "bold");
    if (style === "italic") next = has("bold") ? (has("italic") ? "bold" : "bold italic") : (has("italic") ? "normal" : "italic");
    onChange({ fontStyle: next });
  };

  return (
    <div className="pt-4 space-y-3">
      <label className="text-xs uppercase tracking-widest block" style={{ color: "var(--color-text-muted)" }}>Estilo de texto</label>

      <div className="flex items-center gap-3 flex-wrap">
        <input type="color" value={element.fill || "#ffffff"} onChange={e => onChange({ fill: e.target.value })} className="w-8 h-8 cursor-pointer" />

        <button onClick={() => toggleStyle("bold")} className="px-3 py-1 text-xs uppercase tracking-widest font-bold"
          style={{ border: `1px solid ${(element.fontStyle || "").includes("bold") ? "var(--color-accent)" : "var(--color-text-muted)"}`, color: (element.fontStyle || "").includes("bold") ? "var(--color-accent)" : "var(--color-text-muted)" }}>B</button>

        <button onClick={() => toggleStyle("italic")} className="px-3 py-1 text-xs uppercase tracking-widest italic"
          style={{ border: `1px solid ${(element.fontStyle || "").includes("italic") ? "var(--color-accent)" : "var(--color-text-muted)"}`, color: (element.fontStyle || "").includes("italic") ? "var(--color-accent)" : "var(--color-text-muted)" }}>I</button>

        {["left", "center", "right"].map(align => (
          <button key={align} onClick={() => onChange({ align })} className="px-3 py-1 text-xs uppercase tracking-widest"
            style={{ border: `1px solid ${element.align === align ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}`, color: element.align === align ? "var(--color-accent-secondary)" : "var(--color-text-muted)" }}>
            {align === "left" ? "⇤" : align === "center" ? "↔" : "⇥"}
          </button>
        ))}

        <button onClick={onOpenFontPicker} className="px-3 py-1 text-xs uppercase tracking-widest"
          style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
          FUENTE: {element.fontFamily}
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Interlineado</label>
          <input type="range" min="0.8" max="2.5" step="0.1" value={element.lineHeight ?? 1} onChange={e => onChange({ lineHeight: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Espaciado entre letras</label>
          <input type="range" min="-2" max="20" step="0.5" value={element.letterSpacing ?? 0} onChange={e => onChange({ letterSpacing: parseFloat(e.target.value) })} />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onChange({ curved: !element.curved })}
          className="px-3 py-1 text-xs uppercase tracking-widest"
          style={{ border: `1px solid ${element.curved ? "var(--color-accent)" : "var(--color-text-muted)"}`, color: element.curved ? "var(--color-accent)" : "var(--color-text-muted)" }}>
          Texto curvo
        </button>

        {element.curved && (
          <>
            <button onClick={() => onChange({ curveDirection: "up" })}
              className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${(element.curveDirection ?? "up") === "up" ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}`, color: (element.curveDirection ?? "up") === "up" ? "var(--color-accent-secondary)" : "var(--color-text-muted)" }}>
              ⌢ Arriba
            </button>
            <button onClick={() => onChange({ curveDirection: "down" })}
              className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${element.curveDirection === "down" ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}`, color: element.curveDirection === "down" ? "var(--color-accent-secondary)" : "var(--color-text-muted)" }}>
              ⌣ Abajo
            </button>
          </>
        )}
      </div>

      {element.curved && (
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>Intensidad de curva</label>
          <input type="range" min="5" max="100" step="5" value={element.curveIntensity ?? 30} onChange={e => onChange({ curveIntensity: parseFloat(e.target.value) })} />
        </div>
      )}
    </div>
  );
}
