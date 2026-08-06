const API = import.meta.env.VITE_API_URL;

export const getSeriesDiscountRules = async (token) => {
  const res = await fetch(`${API}/admin/series-discount-rules`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || "Error al cargar reglas de descuento");
  return data.data;
};

export const createSeriesDiscountRule = async (payload, token) => {
  const res = await fetch(`${API}/admin/series-discount-rules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || "Error al crear regla");
  return data.data;
};

export const updateSeriesDiscountRule = async (id_discount_rule, payload, token) => {
  const res = await fetch(`${API}/admin/series-discount-rules/${id_discount_rule}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || "Error al actualizar regla");
  return data.data;
};

export const deleteSeriesDiscountRule = async (id_discount_rule, token) => {
  const res = await fetch(`${API}/admin/series-discount-rules/${id_discount_rule}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || "Error al eliminar regla");
  return data;
};