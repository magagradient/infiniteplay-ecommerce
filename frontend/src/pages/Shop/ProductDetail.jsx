import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import RelatedProducts from "../../components/RelatedProducts";

const API = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mainWatermark, setMainWatermark] = useState(null);
  const { formatPrice } = useLocation();

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

          {/* Botón */}
          <button
            onClick={() => addToCart(product.id_product)}
            className="w-full py-4 px-8 bg-accent text-bg-dark font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            AGREGAR_AL_CARRITO
          </button>

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