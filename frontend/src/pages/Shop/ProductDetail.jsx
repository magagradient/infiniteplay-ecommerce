import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import RelatedProducts from "../../components/RelatedProducts";


const API = import.meta.env.VITE_API_URL;

const USAGE_LICENSE = {
  allowed: [
    "Lanzamientos musicales (streaming, singles, álbumes)",
    "Redes sociales",
    "Marketing y promoción",
    "Merchandising / branding de tu marca como artista",
  ],
  notAllowed: [
    "Revender el diseño, tal cual o modificado",
    "Redistribuir los archivos originales",
    "Reclamar la autoría del diseño",
    "Usarlo para crear o vincularlo a NFTs",
  ],
};

const INCLUDED_FILES = [
  "Sin marca de agua",
  "Listo para Spotify, Apple Music, YouTube Music y demás plataformas",
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mainWatermark, setMainWatermark] = useState(null);
  const { formatPrice } = useLocation();
  const [labMenuOpen, setLabMenuOpen] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.data.product);
          setMainImage(data.data.product.images?.[0]?.image_url || null);
          setMainWatermark(data.data.product.images?.[0]?.watermark_url || null);
        }
      } catch (error) {
        console.error("Error al traer producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-text-muted text-xs uppercase tracking-widest p-16">[LOADING_DATA...]</p>;
  if (!product) return <p className="text-accent text-xs uppercase tracking-widest p-16">[PRODUCTO_NO_ENCONTRADO]</p>;

  return (
    <div className="min-h-screen bg-bg-dark px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 justify-center">

        {/* Imágenes */}
        <div className="flex flex-col gap-4 max-w-md">

          <div className="aspect-square overflow-hidden border border-text-muted/30 cursor-zoom-in" onClick={() => setZoomOpen(true)}>
            {mainImage ? (
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-light flex items-center justify-center text-text-muted text-xs uppercase">
                [SIN_IMAGEN]
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img) => (
                <button
                  key={img.id_image}
                  onClick={() => { setMainImage(img.image_url); setMainWatermark(img.watermark_url || null); }}
                  className={`w-16 h-16 overflow-hidden border transition-all ${mainImage === img.image_url ? "border-accent" : "border-text-muted/30 hover:border-accent-secondary"}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Leyenda de la preview */}
          <ul className="space-y-1">
            <li className="text-text-muted text-xs flex items-start gap-2">
              <span className="text-accent-secondary">•</span> Click en la imagen para hacer zoom
            </li>
            <li className="text-text-muted text-xs flex items-start gap-2">
              <span className="text-accent-secondary">•</span> Vista previa con marca de agua
            </li>
            <li className="text-text-muted text-xs flex items-start gap-2">
              <span className="text-accent-secondary">•</span> El archivo en alta resolución se entrega tras la compra
            </li>
          </ul>

        </div>

        {/* Info */}

        <div className="flex flex-col gap-6 max-w-lg">

          <div>
            <div className="inline-block px-2 py-1 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.5em] mb-4">
              {product.category?.name || "SIN_CATEGORÍA"}
            </div>
            <h1 className="text-[40px] font-bold text-text-primary uppercase tracking-tighter leading-none mb-2">
              {product.title}
            </h1>
            <p className="text-text-muted text-sm mb-4">{product.description}</p>
            {product.description_long && (
              <p className="text-text-muted text-sm border-l border-text-muted/30 pl-4 mt-2">
                {product.description_long}
              </p>
            )}
          </div>

          {/* Included Resources: qué trae el combo */}
          {product.includedResources?.length > 0 && (
            <div className="border-t border-text-muted/30 pt-4">
              <p className="text-accent-secondary text-xs uppercase tracking-widest mb-3">
                // RECURSOS_INCLUIDOS
              </p>
              <ul className="space-y-1.5">
                {product.includedResources.map((res) => (
                  <li key={res.id_resource} className="text-text-muted text-sm flex items-center gap-2">
                    <span className="text-accent-secondary">✔</span>
                    {res.category?.name} <span className="text-text-primary">× {res.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-text-muted/30 pt-4">
            <p className="text-accent text-2xl font-bold">{formatPrice(product.price)}</p>
            <p className="text-accent-secondary text-xs uppercase mt-1">// LIC_BASIC</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.keywords?.map(k => (
              <span key={k.id_keyword} className="border border-accent-secondary/40 text-accent-secondary text-xs px-2 py-1 uppercase hover:border-accent-secondary hover:text-accent-secondary transition-all">
                {k.name}
              </span>
            ))}
            {product.colors?.map(c => (
              <span key={c.id_color} className="border border-text-muted/30 text-text-muted text-xs px-2 py-1 uppercase hover:border-accent hover:text-accent transition-all">
                {c.name}
              </span>
            ))}
          </div>

          {/* Series */}
          {product.series && (
            <p className="text-text-muted text-xs uppercase border-l border-accent pl-4">
              SERIE: {product.series.title}
            </p>
          )}

          {/* Datos técnicos (antes "Ficha técnica") */}
          {product.technicalDetails?.length > 0 && (
            <div className="border-t border-text-muted/30 pt-4">
              <p className="text-accent-secondary text-xs uppercase tracking-widest mb-3">
                // DATOS_TÉCNICOS
              </p>
              <div className="space-y-2">
                {product.technicalDetails.map((detail) => (
                  <div key={detail.id_detail} className="flex justify-between items-center text-sm border-b border-text-muted/10 pb-2">
                    <span className="text-text-muted uppercase text-xs tracking-widest">{detail.label}</span>
                    <span className="text-text-primary">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Archivos incluidos */}
          <div className="border-t border-text-muted/30 pt-4">
            <p className="text-accent-secondary text-xs uppercase tracking-widest mb-3">
              // ARCHIVOS_INCLUIDOS
            </p>
            <ul className="space-y-1.5">
              {INCLUDED_FILES.map((item, i) => (
                <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                  <span className="text-accent-secondary">✔</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Protocolo de uso (Licencia) */}
          <div className="border-t border-text-muted/30 pt-4">
            <p className="text-accent-secondary text-xs uppercase tracking-widest mb-3">
              // PROTOCOLO_DE_USO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-accent-secondary text-[11px] uppercase tracking-widest mb-2">Permitido</p>
                <ul className="space-y-1.5">
                  {USAGE_LICENSE.allowed.map((item, i) => (
                    <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                      <span className="text-accent-secondary">✔</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-accent text-[11px] uppercase tracking-widest mb-2">No permitido</p>
                <ul className="space-y-1.5">
                  {USAGE_LICENSE.notAllowed.map((item, i) => (
                    <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                      <span className="text-accent">✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Propiedad exclusiva */}
          <div className="border-t border-text-muted/30 pt-4">
            <p className="text-accent-secondary text-xs uppercase tracking-widest mb-2">
              // PROPIEDAD_EXCLUSIVA
            </p>
            <p className="text-text-muted text-sm">
              Esta obra se vende una sola vez. Tras la compra, se retira permanentemente del catálogo y pasa al archivo histórico de Infinite Play — ningún otro artista podrá adquirirla.
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={() => addToCart(product.id_product)}
            className="w-full py-4 px-8 bg-accent text-bg-dark font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            AGREGAR_AL_CARRITO
          </button>

          {(() => {
            const labImages = product.images?.filter(i => i.image_type === "cover" || i.image_type === "banner") || [];
            if (labImages.length === 0) return null;

            if (labImages.length === 1) {
              const img = labImages[0];
              return (
                <button
                  onClick={() => navigate(`/lab?product=${product.id_product}&image=${img.id_image}&format=${img.image_type}`)}
                  className="w-full py-4 px-8 border border-accent-secondary text-accent-secondary font-bold uppercase tracking-widest hover:bg-accent-secondary hover:text-bg-dark transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">edit</span>
                  PROBAR_EN_EL_LAB
                </button>
              );
            }

            return (
              <div className="relative">
                <button
                  onClick={() => setLabMenuOpen(o => !o)}
                  className="w-full py-4 px-8 border border-accent-secondary text-accent-secondary font-bold uppercase tracking-widest hover:bg-accent-secondary hover:text-bg-dark transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">edit</span>
                  PROBAR_EN_EL_LAB
                </button>
                {labMenuOpen && (
                  <div className="absolute left-0 right-0 mt-1 border border-accent-secondary bg-bg-dark z-10 max-h-64 overflow-y-auto">
                    {labImages.map((img, i) => (
                      <button key={img.id_image}
                        onClick={() => navigate(`/lab?product=${product.id_product}&image=${img.id_image}&format=${img.image_type}`)}
                        className="w-full py-2 px-4 flex items-center gap-3 text-left text-xs uppercase tracking-widest text-text-muted hover:text-accent-secondary hover:bg-bg-light transition-all"
                      >
                        <img src={img.watermark_url || img.image_url} alt="" className="w-10 h-10 object-cover border border-text-muted/30" />
                        {img.image_type === "cover" ? "Cover" : "Banner"} {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <RelatedProducts product={product} />

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-bg-dark/95 flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={mainWatermark || mainImage}
            alt={product.title}
            className="max-h-screen max-w-screen object-contain"
          />
        </div>
      )}

    </div>
  );
}
