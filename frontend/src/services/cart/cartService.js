const API = import.meta.env.VITE_API_URL;

export const getCartSummary = async (id_cart, token) => {
  const res = await fetch(`${API}/cart_items/summary?id_cart=${id_cart}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || "Error al calcular el resumen del carrito");
  return data.data;
};