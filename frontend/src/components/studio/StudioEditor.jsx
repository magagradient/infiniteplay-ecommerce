import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Rect, Circle, Line, Transformer, Group } from "react-konva";
import useImage from "use-image";
import StudioResourceModal from "./StudioResourceModal";
import TextPropertiesPanel from "./TextPropertiesPanel";
import StudioDraftsModal from "./StudioDraftsModal";


const API = import.meta.env.VITE_API_URL;


const FORMATS = {
  cover: { label: "COVER ART", width: 500, height: 500, exportWidth: 3000, exportHeight: 3000 },
  flyer: { label: "FLYER (A4)", width: 350, height: 495, exportWidth: 2480, exportHeight: 3508 },
  banner: { label: "BANNER", width: 500, height: 180, exportWidth: 1500, exportHeight: 500 },
};


const FONTS = ["Space Grotesk", "Arial", "Georgia", "Courier New", "Impact"];

function UploadedImage({ src, width, height }) {
  const [image] = useImage(src, "anonymous");
  return image ? <KonvaImage image={image} width={width} height={height} listening={false} /> : null;
}

// renderiza un recurso del studio (sticker/forma) traído de la API
function ResourceImage({ src, ...props }) {
  const [image] = useImage(src, "anonymous");
  return image ? <KonvaImage {...props} image={image} /> : null;
}

let measureCtx;
function getMeasureCtx() {
  if (!measureCtx) {
    measureCtx = document.createElement("canvas").getContext("2d");
  }
  return measureCtx;
}

// renderiza texto curvo: dibuja cada letra por separado sobre un arco
function CurvedText({ el, commonProps }) {
  const { text, fontSize, fontFamily, fontStyle, fill, letterSpacing = 0, curveIntensity = 30, curveDirection = "up" } = el;

  const ctx = getMeasureCtx();
  const weight = (fontStyle || "").includes("bold") ? "bold " : "";
  const italic = (fontStyle || "").includes("italic") ? "italic " : "";
  ctx.font = `${italic}${weight}${fontSize}px ${fontFamily}`;

  const chars = text.split("");
  const widths = chars.map(c => ctx.measureText(c).width + letterSpacing);
  const totalWidth = widths.reduce((a, b) => a + b, 0) || 1;

  const intensity = Math.max(curveIntensity, 1) / 100;
  const angleSpread = intensity * Math.PI;
  const radius = totalWidth / angleSpread;
  const dir = curveDirection === "up" ? -1 : 1;

  let cum = 0;
  const raw = chars.map((c, i) => {
    const w = widths[i];
    const centerCum = cum + w / 2;
    cum += w;
    const t = centerCum / totalWidth - 0.5;
    const angle = t * angleSpread;
    const x = radius * Math.sin(angle);
    const y = dir * radius * (1 - Math.cos(angle));
    const rotationDeg = dir * (angle * 180 / Math.PI);
    return { c, w, x, y, rotationDeg };
  });

  // normaliza para que la esquina arriba-izquierda del texto curvo quede en (0,0),
  // igual que el ancla del texto recto - así no salta al activar/desactivar curva
  const minX = Math.min(...raw.map(r => r.x - r.w / 2));
  const minY = Math.min(...raw.map(r => r.y - fontSize / 2));

  const letters = raw.map((r, i) => (
    <Text key={i} text={r.c} x={r.x - minX} y={r.y - minY} rotation={r.rotationDeg}
      fontSize={fontSize} fontFamily={fontFamily} fontStyle={fontStyle || "normal"}
      fill={fill} offsetX={r.w / 2} offsetY={fontSize / 2} />
  ));

  return <Group {...commonProps} x={el.x} y={el.y}>{letters}</Group>;
}

export default function StudioEditor({ hasAccess, canSaveDraft, token, studioProduct, initialFormat, initialImageId }) {
  const [format, setFormat] = useState(initialFormat || "cover");
  const [orientation, setOrientation] = useState("vertical");
  const [fields, setFields] = useState({ artist: "", album: "", year: "", extra: "" });
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);


  const stageRef = useRef(null);
  const rawFmt = FORMATS[format];
  const fmt = orientation === "horizontal"
    ? { ...rawFmt, width: rawFmt.height, height: rawFmt.width, exportWidth: rawFmt.exportHeight, exportHeight: rawFmt.exportWidth }
    : rawFmt;
  const transformerRef = useRef(null);
  const layerRef = useRef(null);
  const pendingResourceFiles = useRef({});
  const canvasContainerRef = useRef(null);
  const [displayScale, setDisplayScale] = useState(1);
  const gridRef = useRef(null);
  const isSpacePressed = useRef(false);


  // recursos del studio (imágenes) traídos de la API
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState(null);
  const [backgroundProductId, setBackgroundProductId] = useState(null);
  const [downloadBlockedReason, setDownloadBlockedReason] = useState(null);

  // fuentes curadas del studio
  const [fonts, setFonts] = useState([]);

  // modal de biblioteca (imágenes / fuentes)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("images");
  const [draftsOpen, setDraftsOpen] = useState(false);

  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.25));
  const resetZoom = () => { setZoom(1); setStagePos({ x: 0, y: 0 }); };
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const openFullscreen = () => {
    if (!stageRef.current) return;
    const wasSelected = selectedId;
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    setFullscreenImg(uri);
    setIsFullscreen(true);
    if (wasSelected && transformerRef.current) {
      const node = stageRef.current.findOne(`#${wasSelected}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  };

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e) => { if (e.key === "Escape") setIsFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const el = canvasContainerRef.current;
    const observer = new ResizeObserver(() => {
      const availableWidth = el.clientWidth;
      const availableHeight = window.innerHeight - 220;
      const scaleByWidth = availableWidth / fmt.width;
      const scaleByHeight = availableHeight / fmt.height;
      const scale = Math.min((availableWidth * 0.85) / fmt.width, scaleByHeight, 1.8);
      console.log({ availableWidth, availableHeight, scaleByWidth, scaleByHeight, scale, fmtWidth: fmt.width, fmtHeight: fmt.height, windowWidth: window.innerWidth, gridWidth: gridRef.current?.clientWidth });
      setDisplayScale(scale > 0 ? scale : 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fmt.width, fmt.height]);

  useEffect(() => {
    if (!selectedId) return;
    // Espera un frame para que el panel de controles ya esté renderizado en el DOM
    // antes de calcular cuánto hay que scrollear.
    const timer = setTimeout(() => {
      const panel = document.getElementById("layer-controls-panel");
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedId]);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.code === "Space") isSpacePressed.current = true; };
    const onKeyUp = (e) => { if (e.code === "Space") isSpacePressed.current = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage() && isSpacePressed.current) {
      isPanning.current = true;
      lastPointer.current = e.target.getStage().getPointerPosition();
    }
  };
  const handleStageMouseMove = (e) => {
    if (!isPanning.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const dx = pos.x - lastPointer.current.x;
    const dy = pos.y - lastPointer.current.y;
    lastPointer.current = pos;
    setStagePos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };
  const handleStageMouseUp = () => { isPanning.current = false; };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    setZoom(z => {
      const next = z - e.evt.deltaY * 0.001;
      return Math.min(3, Math.max(0.25, next));
    });
  };

  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) return;
    const stage = stageRef.current;
    const selectedNode = selectedId ? stage.findOne(`#${selectedId}`) : null;

    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer().batchDraw();
  }, [selectedId, elements]);

  useEffect(() => {
    fetch(`${API}/studio/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const cats = data.data || [];
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id_studio_category);
      })
      .catch(() => setResourcesError("No se pudieron cargar los recursos"))
      .finally(() => setLoadingResources(false));
  }, [token]);

  useEffect(() => {
    fetch(`${API}/studio/fonts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setFonts(data);
        if (data.length > 0) {
          const families = data.map(f => f.google_font_name.replace(/ /g, "+")).join("&family=");
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
          document.head.appendChild(link);
        }
      });
  }, [token]);

  useEffect(() => {
    if (!studioProduct) return;
    let img = null;
    if (initialImageId) {
      img = studioProduct.images?.find(i => String(i.id_image) === String(initialImageId));
    }
    if (!img) {
      const targetType = ["cover", "banner"].includes(initialFormat) ? initialFormat : "cover";
      img = studioProduct.images?.find(i => i.image_type === targetType);
    }
    const watermarked = img?.watermark_url || img?.image_url;
    if (watermarked) {
      setImageUrl(watermarked);
      setImageFile(null);
      setBackgroundProductId(studioProduct.id_product);
    }
  }, [studioProduct]);

  const addTextToCanvas = (key) => {
    const text = fields[key];
    if (!text) return;
    const textCount = elements.filter(el => el.type === "text").length;
    setElements(prev => [
      ...prev,
      {
        id: `text-${key}-${Date.now()}`,
        type: "text",
        text,
        x: 20,
        y: 20 + textCount * 40,
        fontSize: 32,
        fontFamily: "Space Grotesk",
        fontStyle: "normal",
        align: "left",
        lineHeight: 1,
        letterSpacing: 0,
        fill: "#ffffff",
        rotation: 0,
        opacity: 1,
      },
    ]);
  };

  const loadDraft = (draft) => {
    setElements(draft.elements);
    setFormat(draft.format);
    setImageUrl(draft.background_image_url || null);
    setImageFile(null);
    setBackgroundProductId(draft.id_product || null);
    setSelectedId(null);
  };

  // agrega un recurso (sticker/forma) al canvas como elemento independiente
  const addResourceToCanvas = (resource) => {
    const size = 80;
    setElements(prev => [
      ...prev,
      {
        id: `resource-${resource.id_studio_resource}-${Date.now()}`,
        type: "resource",
        src: resource.url,
        x: fmt.width / 2 - size / 2,
        y: fmt.height / 2 - size / 2,
        width: size,
        height: size,
        rotation: 0,
        opacity: 1,
      },
    ]);
  };

  const addOwnResourceToCanvas = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const size = 100;
    const id = `own-resource-${Date.now()}`;
    pendingResourceFiles.current[id] = file;
    setElements(prev => [
      ...prev,
      {
        id,
        type: "resource",
        src: URL.createObjectURL(file),
        x: fmt.width / 2 - size / 2,
        y: fmt.height / 2 - size / 2,
        width: size,
        height: size,
        rotation: 0,
        opacity: 1,
      },
    ]);
    e.target.value = ""; // permite volver a elegir el mismo archivo dos veces seguidas
  };

  const resolvePendingResources = async () => {
    const entries = Object.entries(pendingResourceFiles.current);
    if (entries.length === 0) return elements;

    const uploads = await Promise.all(entries.map(async ([elId, file]) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API}/studio/user-resources`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      return [elId, data.data?.url];
    }));

    const urlMap = Object.fromEntries(uploads);
    const resolved = elements.map(el => urlMap[el.id] ? { ...el, src: urlMap[el.id] } : el);

    setElements(resolved);
    pendingResourceFiles.current = {};
    return resolved;
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setBackgroundProductId(null);
  };

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

  const removeElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const sendToEdge = (id, edge) => {
    setElements(prev => {
      const idx = prev.findIndex(el => el.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const [el] = newArr.splice(idx, 1);
      if (edge === "front") newArr.push(el);
      else newArr.unshift(el);
      return newArr;
    });
  };

  const handleDownload = async () => {
    if (!stageRef.current || !transformerRef.current) return;

    if (backgroundProductId) {
      try {
        const res = await fetch(`${API}/products/${backgroundProductId}/purchased`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.data?.purchased) {
          setDownloadBlockedReason("Tenés que comprar esta obra puntual para descargarla con tu edición.");
          return;
        }
      } catch (err) {
        console.error(err);
        setDownloadBlockedReason("No se pudo verificar la compra. Probá de nuevo.");
        return;
      }
    }

    setDownloadBlockedReason(null);

    // Ocultar el Transformer antes de exportar
    transformerRef.current.nodes([]);
    transformerRef.current.getLayer().batchDraw();

    const scale = fmt.exportWidth / fmt.width;
    const uri = stageRef.current.toDataURL({ pixelRatio: scale });
    const a = document.createElement("a");
    a.href = uri;
    a.download = `infinite-play-${format}.png`;
    a.click();

    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  };

  const activeResources = categories.find(c => c.id_studio_category === activeCategory)?.resources || [];

  // helper para editar el elemento actualmente seleccionado (usado por el panel de texto y el picker de fuentes)
  const updateSelectedElement = (props) => {
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...props } : el));
  };

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  return (
    <div style={{ fontFamily: "Space Grotesk" }}>

      {/* Controles */}
      <div ref={gridRef} className="flex flex-col md:flex-row items-start gap-12 mb-8 pt-6">

        {/* Izquierda — configuración */}
        <div className="space-y-4 w-full md:w-[480px] flex-shrink-0">

          {/* Formato */}
          <div>
            <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "var(--color-text-muted)" }}>Formato</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(FORMATS).map(([key, val]) => {
                const locked = backgroundProductId && key !== format;
                return (
                  <button key={key} disabled={locked} onClick={() => !locked && setFormat(key)}
                    title={locked ? "Este producto viene en un formato específico. Subí tu propia imagen para probar otros formatos." : undefined}
                    className="px-3 py-1 text-xs uppercase tracking-widest transition-all"
                    style={{
                      background: format === key ? "var(--color-accent)" : "transparent",
                      color: format === key ? "var(--color-text)" : "var(--color-text-muted)",
                      border: `1px solid ${format === key ? "var(--color-accent)" : "var(--color-text-muted)"}`,
                      opacity: locked ? 0.35 : 1,
                      cursor: locked ? "not-allowed" : "pointer",
                    }}>
                    {val.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest block mb-2" style={{ color: "var(--color-text-muted)" }}>Orientación</label>
            <div className="flex gap-2">
              <button onClick={() => setOrientation("vertical")}
                className="px-3 py-1 text-xs uppercase tracking-widest transition-all"
                style={{
                  background: orientation === "vertical" ? "var(--color-accent)" : "transparent",
                  color: orientation === "vertical" ? "var(--color-text)" : "var(--color-text-muted)",
                  border: `1px solid ${orientation === "vertical" ? "var(--color-accent)" : "var(--color-text-muted)"}`,
                }}>
                ↕ VERTICAL
              </button>
              <button onClick={() => setOrientation("horizontal")}
                className="px-3 py-1 text-xs uppercase tracking-widest transition-all"
                style={{
                  background: orientation === "horizontal" ? "var(--color-accent)" : "transparent",
                  color: orientation === "horizontal" ? "var(--color-text)" : "var(--color-text-muted)",
                  border: `1px solid ${orientation === "horizontal" ? "var(--color-accent)" : "var(--color-text-muted)"}`,
                }}>
                ↔ HORIZONTAL
              </button>
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
              <div key={key} className="flex gap-2">
                <input value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2 text-xs uppercase tracking-widest outline-none"
                  style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                  onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"} />
                <button onClick={() => addTextToCanvas(key)}
                  className="px-3 py-2 text-xs uppercase tracking-widest whitespace-nowrap"
                  style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                  + Agregar
                </button>
              </div>
            ))}
          </div>

          {/* Biblioteca de recursos (imágenes y fuentes) — ahora vive en modal aparte */}

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setModalTab("images"); setModalOpen(true); }}
              className="px-4 py-2 text-xs uppercase tracking-widest"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              📂 Abrir biblioteca de recursos
            </button>

            {canSaveDraft && (
              <button onClick={() => setDraftsOpen(true)}
                className="px-4 py-2 text-xs uppercase tracking-widest"
                style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
                💾 Mis borradores
              </button>
            )}

            <label className="px-4 py-2 text-xs uppercase tracking-widest cursor-pointer"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              🖼️ Subir mi recurso
              <input type="file" accept="image/*" onChange={addOwnResourceToCanvas} className="hidden" />
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 flex-wrap pt-2">
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
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 text-xs uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                  COMPRÁ UNA OBRA PARA DESCARGAR
                </div>
              )}
            </div>
            {downloadBlockedReason && (
              <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "var(--color-accent)" }}>
                {downloadBlockedReason}
              </p>
            )}
          </div>

          {/* Capas */}
          {selectedId && (
            <div id="layer-controls-panel" className="pt-4 space-y-2">
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
                <button onClick={() => removeElement(selectedId)}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                  style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
                  ✕ ELIMINAR
                </button>
                <button onClick={() => sendToEdge(selectedId, "front")}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                  style={{ border: "1px solid var(--color-accent-secondary)", color: "var(--color-accent-secondary)" }}>
                  ⇈ AL FRENTE
                </button>
                <button onClick={() => sendToEdge(selectedId, "back")}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                  style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
                  ⇊ AL FONDO
                </button>
              </div>
            </div>
          )}

          {/* Propiedades de texto — solo si el elemento seleccionado es texto */}
          {selectedElement?.type === "text" && (
            <TextPropertiesPanel
              element={selectedElement}
              onChange={updateSelectedElement}
              onOpenFontPicker={() => { setModalTab("fonts"); setModalOpen(true); }}
            />
          )}
        </div>

        {/* Derecha — canvas */}
        <div className="w-full" style={{ position: "sticky", top: "1.5rem", minWidth: 0 }}>
          <label className="text-xs uppercase tracking-widest block mb-2 text-center" style={{ color: "var(--color-text-muted)" }}>
            PREVIEW — {fmt.exportWidth}×{fmt.exportHeight}px
          </label>

          <div className="flex items-center justify-center gap-2 mb-2">
            <button onClick={zoomOut} className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              −
            </button>
            <span className="text-xs" style={{ color: "var(--color-text-muted)", minWidth: 40, textAlign: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={zoomIn} className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              +
            </button>
            <button onClick={resetZoom} className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              Restablecer
            </button>
            <button onClick={openFullscreen} className="px-3 py-1 text-xs uppercase tracking-widest"
              style={{ border: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
              ⛶ Ver completo
            </button>
          </div>

          <p className="text-center text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
            Mantené ESPACIO + arrastrá para mover la vista
          </p>

          <div ref={canvasContainerRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: fmt.width * displayScale,
              height: fmt.height * displayScale,
              border: "1px solid var(--color-text-muted)",
              overflow: "hidden",
            }}>
              <div style={{ transform: `scale(${displayScale})`, transformOrigin: "top left", width: fmt.width, height: fmt.height, cursor: "grab" }}>
                <Stage ref={stageRef} width={fmt.width} height={fmt.height}
                  scaleX={zoom} scaleY={zoom} onWheel={handleWheel}
                  x={stagePos.x} y={stagePos.y}
                  onMouseDown={handleStageMouseDown}
                  onMouseMove={handleStageMouseMove}
                  onMouseUp={handleStageMouseUp}
                  onMouseLeave={handleStageMouseUp}
                  onClick={() => setSelectedId(null)}>
                  <Layer ref={layerRef}>
                    {imageUrl && <UploadedImage src={imageUrl} width={fmt.width} height={fmt.height} />}
                    {elements.map(el => {
                      const isSelected = el.id === selectedId;
                      const commonProps = {
                        key: el.id,
                        id: el.id,
                        onClick: (e) => { e.cancelBubble = true; setSelectedId(el.id); },
                        draggable: true,
                        onDragEnd: (e) => {
                          setElements(prev => prev.map(item =>
                            item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                          ));
                        },
                        onTransformEnd: (e) => {
                          const node = e.target;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();
                          node.scaleX(1);
                          node.scaleY(1);
                          setElements(prev => prev.map(item => {
                            if (item.id !== el.id) return item;
                            if (item.type === "circle") {
                              return { ...item, x: node.x(), y: node.y(), radius: Math.max(5, item.radius * scaleX), rotation: node.rotation() };
                            }
                            if (item.type === "text") {
                              return { ...item, x: node.x(), y: node.y(), fontSize: Math.max(6, item.fontSize * scaleY), rotation: node.rotation() };
                            }
                            return {
                              ...item,
                              x: node.x(),
                              y: node.y(),
                              width: Math.max(10, item.width * scaleX),
                              height: Math.max(10, item.height * scaleY),
                              rotation: node.rotation(),
                            };
                          }));
                        },
                        opacity: el.opacity,
                        rotation: el.rotation,
                        stroke: isSelected ? "white" : el.stroke,
                        strokeWidth: isSelected ? 2 : el.strokeWidth,
                      };
                      if (el.type === "text") {
                        if (el.curved) return <CurvedText key={el.id} el={el} commonProps={commonProps} />;
                        return (
                          <Text {...commonProps} x={el.x} y={el.y} text={el.text} fontSize={el.fontSize}
                            fontFamily={el.fontFamily} fontStyle={el.fontStyle || "normal"}
                            align={el.align || "left"} lineHeight={el.lineHeight ?? 1}
                            letterSpacing={el.letterSpacing ?? 0}
                            fill={isSelected ? "white" : el.fill} />
                        );
                      }
                      if (el.type === "rect") return (
                        <Rect {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} />
                      );
                      if (el.type === "circle") return (
                        <Circle {...commonProps} x={el.x} y={el.y} radius={el.radius} fill={el.fill} />
                      );
                      if (el.type === "line") return (
                        <Line {...commonProps} x={el.x} y={el.y} points={el.points} />
                      );
                      if (el.type === "resource") return (
                        <ResourceImage {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} src={el.src} />
                      );
                      return null;
                    })}
                    <Transformer
                      ref={transformerRef}
                      rotateEnabled={true}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) return oldBox;
                        return newBox;
                      }}
                    />
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
        </div>

      </div>

      <StudioResourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        fonts={fonts}
        onSelectResource={addResourceToCanvas}
        onApplyFont={(fontFamily) => updateSelectedElement({ fontFamily })}
        initialTab={modalTab}
        selectedElement={selectedElement}
      />

      {canSaveDraft && (
        <StudioDraftsModal
          isOpen={draftsOpen}
          onClose={() => setDraftsOpen(false)}
          token={token}
          format={format}
          elements={elements}
          imageUrl={imageUrl}
          imageFile={imageFile}
          idProduct={backgroundProductId}
          onLoadDraft={loadDraft}
          resolvePendingResources={resolvePendingResources}
        />
      )}

      {isFullscreen && (
        <div onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)", cursor: "zoom-out" }}>
          <img src={fullscreenImg} alt="Preview completo"
            style={{ maxWidth: "95vw", maxHeight: "95vh", objectFit: "contain" }} />
          <button onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 px-4 py-2 text-xs uppercase tracking-widest"
            style={{ border: "1px solid white", color: "white" }}>
            ✕ Cerrar
          </button>
        </div>
      )}
    </div>

  );
}
