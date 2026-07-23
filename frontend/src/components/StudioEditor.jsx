import { useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Rect, Circle, Line } from "react-konva";
import useImage from "use-image";

const FORMATS = {
  cover: { label: "COVER ART", width: 500, height: 500, exportWidth: 3000, exportHeight: 3000 },
  flyer: { label: "FLYER VERTICAL", width: 280, height: 500, exportWidth: 1080, exportHeight: 1920 },
  banner: { label: "BANNER", width: 500, height: 180, exportWidth: 1500, exportHeight: 500 },
};

const FONTS = ["Space Grotesk", "Arial", "Georgia", "Courier New", "Impact"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateElements(fields, width, height) {
  const texts = Object.values(fields).filter(Boolean);
  const elements = [];

  texts.forEach((text, i) => {
    const fontSize = randomBetween(14, 48);
    elements.push({
      id: `text-${i}`,
      type: "text",
      text,
      x: randomBetween(10, width * 0.7),
      y: randomBetween(10, height - fontSize),
      fontSize,
      fontFamily: FONTS[Math.floor(Math.random() * FONTS.length)],
      fill: `hsl(${Math.random() * 360}, 80%, 80%)`,
      rotation: randomBetween(-30, 30),
      opacity: randomBetween(0.6, 1),
    });
  });

  const shapeCount = Math.floor(randomBetween(3, 8));
  for (let i = 0; i < shapeCount; i++) {
    const type = ["rect", "circle", "line"][Math.floor(Math.random() * 3)];
    elements.push({
      id: `shape-${i}`,
      type,
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      width: randomBetween(20, 120),
      height: randomBetween(20, 120),
      radius: randomBetween(10, 60),
      stroke: `hsl(${Math.random() * 360}, 80%, 70%)`,
      strokeWidth: randomBetween(1, 4),
      fill: Math.random() > 0.5 ? `hsla(${Math.random() * 360}, 80%, 70%, 0.2)` : "transparent",
      rotation: randomBetween(-45, 45),
      opacity: randomBetween(0.4, 1),
      points: [0, 0, randomBetween(30, 150), randomBetween(30, 150)],
    });
  }

  return elements;
}

function UploadedImage({ src, width, height }) {
  const [image] = useImage(src);
  return image ? <KonvaImage image={image} width={width} height={height} /> : null;
}

export default function StudioEditor({ hasAccess }) {
  const [format, setFormat] = useState("cover");
  const [fields, setFields] = useState({ artist: "", album: "", year: "", extra: "" });
  const [imageUrl, setImageUrl] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);
  const fmt = FORMATS[format];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  };

  const generate = useCallback(() => {
    setElements(generateElements(fields, fmt.width, fmt.height));
  }, [fields, fmt]);

  const moveElement = (id, direction) => {
    setElements(prev => {
      const idx = prev.findIndex(el => el.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const [el] = newArr.splice(idx, 1);
      if (direction === "up") newArr.splice(Math.min(idx + 1, newArr.length), 0, el);
      else newArr.splice(Math.max(idx - 1, 0), 0, el);
      return newArr;
    });
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const scale = fmt.exportWidth / fmt.width;
    const uri = stageRef.current.toDataURL({ pixelRatio: scale });
    const a = document.createElement("a");
    a.href = uri;
    a.download = `infinite-play-${format}.png`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

        {/* Izquierda — configuración */}
        <div className="space-y-4">

          {/* Formato */}
          <div>
            <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "var(--color-text-muted)" }}>Formato</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(FORMATS).map(([key, val]) => (
                <button key={key} onClick={() => setFormat(key)}
                  className="px-3 py-1 text-xs uppercase tracking-widest transition-all"
                  style={{
                    background: format === key ? "var(--color-accent)" : "transparent",
                    color: format === key ? "var(--color-text)" : "var(--color-text-muted)",
                    border: `1px solid ${format === key ? "var(--color-accent)" : "var(--color-text-muted)"}`,
                  }}>
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "var(--color-text-muted)" }}>Imagen</label>
            <label className="block px-4 py-2 text-xs uppercase tracking-widest cursor-pointer transition-all"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent-secondary)"; e.currentTarget.style.color = "var(--color-accent-secondary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-text-muted)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}>
              {imageUrl ? "CAMBIAR IMAGEN" : "SUBIR IMAGEN"}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {/* Campos de texto */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest block" style={{ color: "var(--color-text-muted)" }}>Textos</label>
            {[
              { key: "artist", placeholder: "Nombre del artista" },
              { key: "album", placeholder: "Título del álbum / single" },
              { key: "year", placeholder: "Año (opcional)" },
              { key: "extra", placeholder: "Texto libre (opcional)" },
            ].map(({ key, placeholder }) => (
              <input key={key} value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-xs uppercase tracking-widest outline-none"
                style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3 flex-wrap pt-2">
            <button onClick={generate}
              className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all"
              style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
              GENERAR
            </button>

            {elements.length > 0 && (
              <button onClick={generate}
                className="px-6 py-2 text-xs uppercase tracking-widest transition-all"
                style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
                REGENERAR
              </button>
            )}

            <div className="relative group">
              <button
                onClick={hasAccess ? handleDownload : undefined}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all"
                style={{
                  background: hasAccess ? "var(--color-accent-secondary)" : "transparent",
                  color: hasAccess ? "var(--color-bg-dark)" : "var(--color-text-muted)",
                  border: `1px solid ${hasAccess ? "var(--color-accent-secondary)" : "var(--color-text-muted)"}`,
                  cursor: hasAccess ? "pointer" : "not-allowed",
                  opacity: hasAccess ? 1 : 0.5,
                }}>
                DESCARGAR
              </button>
              {!hasAccess && (
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 text-xs uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                  COMPRÁ UNA OBRA PARA DESCARGAR
                </div>
              )}
            </div>
          </div>

          {/* Capas */}
          {selectedId && (
            <div className="pt-4 space-y-2">
              <label className="text-xs uppercase tracking-widest block" style={{ color: "var(--color-text-muted)" }}>Capa seleccionada</label>
              <div className="flex gap-2">
                <button onClick={() => moveElement(selectedId, "up")}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                  style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
                  ↑ ADELANTE
                </button>
                <button onClick={() => moveElement(selectedId, "down")}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                  style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
                  ↓ ATRÁS
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Derecha — canvas */}
        <div>
          <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "var(--color-text-muted)" }}>
            PREVIEW — {fmt.exportWidth}×{fmt.exportHeight}px
          </label>
          <div style={{ border: "1px solid var(--color-text-muted)", display: "inline-block" }}>
            <Stage ref={stageRef} width={fmt.width} height={fmt.height} onClick={() => setSelectedId(null)}>
              <Layer>
                {imageUrl && <UploadedImage src={imageUrl} width={fmt.width} height={fmt.height} />}
                {elements.map(el => {
                  const isSelected = el.id === selectedId;
                  const commonProps = {
                    key: el.id,
                    onClick: (e) => { e.cancelBubble = true; setSelectedId(el.id); },
                    draggable: true,
                    onDragEnd: (e) => {
                      setElements(prev => prev.map(item =>
                        item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                      ));
                    },
                    opacity: el.opacity,
                    rotation: el.rotation,
                    stroke: isSelected ? "white" : el.stroke,
                    strokeWidth: isSelected ? 2 : el.strokeWidth,
                  };

                  if (el.type === "text") return (
                    <Text {...commonProps} x={el.x} y={el.y} text={el.text} fontSize={el.fontSize} fontFamily={el.fontFamily} fill={isSelected ? "white" : el.fill} />
                  );
                  if (el.type === "rect") return (
                    <Rect {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} />
                  );
                  if (el.type === "circle") return (
                    <Circle {...commonProps} x={el.x} y={el.y} radius={el.radius} fill={el.fill} />
                  );
                  if (el.type === "line") return (
                    <Line {...commonProps} x={el.x} y={el.y} points={el.points} />
                  );
                  return null;
                })}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}