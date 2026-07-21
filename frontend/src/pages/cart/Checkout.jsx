import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import { createMPPreference, createPayPalOrder } from "../../services/api";

const API = import.meta.env.VITE_API_URL;

const FIELD_LABELS = {
  title: { key: "custom_title", label: "TÍTULO" },
  artist: { key: "custom_artist_name", label: "NOMBRE DE ARTISTA" },
  date: { key: "event_date", label: "FECHA Y HORA DEL EVENTO" },
  location: { key: "event_location", label: "LUGAR DEL EVENTO" },
};

export default function Checkout() {
  const { user, token } = useContext(AuthContext);
  const { cart, clearCart } = useCart();
  const { country, formatPrice } = useLocation();
  const navigate = useNavigate();

  const [customData, setCustomData] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((acc, item) => acc + (parseFloat(item.product?.price) * item.quantity), 0);
  const customizableItems = cart.filter((item) => item.product?.is_customizable);

  const updateCustomField = (id_product, fieldKey, value) => {
    setCustomData((prev) => ({
      ...prev,
      [id_product]: { ...prev[id_product], [fieldKey]: value },
    }));
  };

  const getRequiredFields = (product) => product.customization_fields || ["title", "artist"];

  const validateCustomFields = () => {
    for (const item of customizableItems) {
      const required = getRequiredFields(item.product);
      const data = customData[item.product.id_product] || {};
      for (const fieldName of required) {
        const { key, label } = FIELD_LABELS[fieldName] || {};
        if (!key) continue;
        if (!data[key] || !data[key].toString().trim()) {
          return `Completá "${label}" para "${item.product.title}".`;
        }
      }
    }
    return null;
  };

  const handleCheckout = async () => {
    setFormError("");

    const validationError = validateCustomFields();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_user: user.id_user, total: total.toFixed(2), status: "pending" }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Error al crear la orden");
      const id_order = orderData.data.id_order;

      for (const item of cart) {
        const custom = customData[item.product.id_product] || {};
        const res = await fetch(`${API}/orders_products`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            id_order,
            id_product: item.product.id_product,
            quantity: item.quantity,
            unit_price: item.product.price,
            custom_title: custom.custom_title || undefined,
            custom_artist_name: custom.custom_artist_name || undefined,
            event_date: custom.event_date || undefined,
            event_location: custom.event_location || undefined,
            custom_notes: custom.custom_notes || undefined,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.description || errData.message || "Error al procesar un producto de la orden");
        }
      }

      const items = cart.map((item) => ({
        title: item.product.title,
        unit_price: parseFloat(item.product.price),
        quantity: item.quantity,
      }));

      if (country === "AR") {
        const { init_point } = await createMPPreference(token, items, id_order);
        clearCart();
        window.location.href = init_point;
      } else {
        const { approval_url } = await createPayPalOrder(token, items, id_order);
        clearCart();
        window.location.href = approval_url;
      }

    } catch (error) {
      console.error("Error en el checkout:", error);
      setFormError(error.message || "Ocurrió un error al procesar la compra. No se realizó ningún cobro.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-16 py-12" style={{ background: "var(--color-bg-dark)", fontFamily: "Space Grotesk" }}>
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <div className="inline-block px-2 py-1 text-xs font-semibold uppercase tracking-[0.5em] mb-4" style={{ background: "var(--color-accent)", color: "var(--color-text)" }}>
            CHECKOUT
          </div>
          <h1 className="text-[40px] font-bold uppercase tracking-tighter leading-none" style={{ color: "var(--color-text)" }}>
            CONFIRMAR_COMPRA
          </h1>
        </div>

        <div className="mb-8" style={{ border: "1px solid var(--color-text-muted)" }}>
          <div className="px-6 py-3 text-xs uppercase tracking-widest" style={{ borderBottom: "1px solid var(--color-text-muted)", color: "var(--color-text-muted)" }}>
            RESUMEN_DE_ORDEN
          </div>

          {cart.length === 0 ? (
            <p className="px-6 py-4 text-xs uppercase" style={{ color: "var(--color-text-muted)" }}>[CARRITO_VACÍO]</p>
          ) : (
            cart.map((item) => (
              <div key={item.id_item} className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid var(--color-text-muted)" }}>
                <span className="text-sm uppercase" style={{ color: "var(--color-text)" }}>{item.product?.title}</span>
                <span className="text-sm" style={{ color: "var(--color-accent-secondary)" }}>{formatPrice(item.product?.price)}</span>
              </div>
            ))
          )}

          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>TOTAL</span>
            <span className="text-xl font-bold" style={{ color: "var(--color-accent)" }}>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Formularios de personalización, uno por cada producto que lo requiera */}
        {customizableItems.length > 0 && (
          <div className="mb-8 space-y-6">
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-accent-secondary)" }}>
              // PERSONALIZACIÓN REQUERIDA
            </p>

            {customizableItems.map((item) => {
              const required = getRequiredFields(item.product);
              const data = customData[item.product.id_product] || {};

              return (
                <div key={item.id_item} className="px-6 py-5 space-y-3" style={{ border: "1px solid var(--color-accent-secondary)" }}>
                  <p className="text-sm uppercase font-bold" style={{ color: "var(--color-text)" }}>
                    {item.product.title}
                  </p>

                  {required.map((fieldName) => {
                    const field = FIELD_LABELS[fieldName];
                    if (!field) return null;
                    const isDateField = fieldName === "date";

                    return (
                      <div key={fieldName}>
                        <label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                          {field.label}
                        </label>
                        <input
                          type={isDateField ? "datetime-local" : "text"}
                          value={data[field.key] || ""}
                          onChange={(e) => updateCustomField(item.product.id_product, field.key, e.target.value)}
                          className="w-full px-4 py-2 text-sm outline-none transition-colors"
                          style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                          onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                          onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
                        />
                      </div>
                    );
                  })}

                  <div>
                    <label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                      NOTAS ADICIONALES (opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={data.custom_notes || ""}
                      onChange={(e) => updateCustomField(item.product.id_product, "custom_notes", e.target.value)}
                      className="w-full px-4 py-2 text-sm outline-none resize-none transition-colors"
                      style={{ background: "var(--color-bg-light)", border: "1px solid var(--color-text-muted)", color: "var(--color-text)" }}
                      onFocus={e => e.target.style.borderColor = "var(--color-accent-secondary)"}
                      onBlur={e => e.target.style.borderColor = "var(--color-text-muted)"}
                    />
                  </div>
                </div>
              );
            })}

            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Estos productos se entregan editados a medida. Vas a recibir un aviso por mail cuando estén listos para descargar.
            </p>
          </div>
        )}

        <div className="mb-8 px-6 py-4 space-y-2" style={{ border: "1px solid var(--color-text-muted)" }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>USUARIO</p>
          <p className="text-sm" style={{ color: "var(--color-text)" }}>{user?.email}</p>
          <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "var(--color-text-muted)" }}>MÉTODO_DE_PAGO</p>
          <p className="text-sm uppercase" style={{ color: "var(--color-accent-secondary)" }}>
            {country === "AR" ? "MERCADOPAGO" : "PAYPAL"}
          </p>
        </div>

        {formError && (
          <p className="mb-4 px-4 py-3 text-xs uppercase tracking-widest" style={{ border: "1px solid var(--color-accent)", color: "var(--color-accent)" }}>
            [ERROR] {formError}
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || submitting}
          className="w-full py-4 font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--color-accent)", color: "var(--color-text)", border: "1px solid var(--color-accent)" }}
          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-accent)"; } }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-text)"; }}
        >
          <span className="material-symbols-outlined">check_circle</span>
          {submitting ? "PROCESANDO..." : (country === "AR" ? "PAGAR_CON_MERCADOPAGO" : "PAGAR_CON_PAYPAL")}
        </button>

      </div>
    </section>
  );
}
