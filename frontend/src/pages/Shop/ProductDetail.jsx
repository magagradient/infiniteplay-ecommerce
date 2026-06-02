import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { formatPrice } = useLocation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.data.product);
          setMainImage(data.data.product.images?.[0]?.image_url || null);
        }
      } catch (error) {
        console.error("Error al traer producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-[#cbc4d2] text-xs uppercase tracking-widest p-16">[LOADING_DATA...]</p>;
  if (!product) return <p className="text-[#ffb4ab] text-xs uppercase tracking-widest p-16">[PRODUCTO_NO_ENCONTRADO]</p>;

  return (
    <div className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Imágenes */}
        <div className="flex flex-col gap-4">

          <div className="aspect-auto overflow-hidden border border-[#494551] cursor-zoom-in" onClick={() => setZoomOpen(true)}>
            {mainImage ? (
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1d1b20] flex items-center justify-center text-[#494551] text-xs uppercase">
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
                  onClick={() => setMainImage(img.image_url)}
                  className={`w-16 h-16 overflow-hidden border transition-all ${mainImage === img.image_url ? "border-[#ffb4ab]" : "border-[#494551] hover:border-[#ffb4ab]"}`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">

          <div>
            <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
              {product.category?.name || "SIN_CATEGORÍA"}
            </div>
            <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none mb-2">
              {product.title}
            </h1>
            <p className="text-[#cbc4d2] text-sm mb-4">{product.description}</p>
            {product.description_long && (
              <p className="text-[#cbc4d2] text-sm border-l border-[#494551] pl-4 mt-2">
                {product.description_long}
              </p>
            )}
          </div>

          <div className="border-t border-[#494551] pt-4">
            <p className="text-[#ffb4ab] text-2xl font-bold">{formatPrice(product.price)}</p>
            <p className="text-[#cbc4d2] text-xs uppercase mt-1">// LIC_BASIC</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.keywords?.map(k => (
              <span key={k.id_keyword} className="border border-[#494551] text-[#cbc4d2] text-xs px-2 py-1 uppercase hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all">
                {k.name}
              </span>
            ))}
            {product.colors?.map(c => (
              <span key={c.id_color} className="border border-[#494551] text-[#cbc4d2] text-xs px-2 py-1 uppercase hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all">
                {c.name}
              </span>
            ))}
          </div>

          {/* Series */}
          {product.series && (
            <p className="text-[#cbc4d2] text-xs uppercase border-l border-[#ffb4ab] pl-4">
              SERIE: {product.series.title}
            </p>
          )}

          {/* Botón */}
          <button
            onClick={() => addToCart(product.id_product)}
            className="w-full py-4 bg-[#ffb4ab] text-[#690005] font-bold uppercase tracking-widest hover:bg-transparent hover:border hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            AGREGAR_AL_CARRITO
          </button>

        </div>
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={mainImage}
            alt={product.title}
            className="max-h-screen max-w-screen object-contain"
          />
        </div>
      )}

    </div>
  );
}