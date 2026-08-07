const API = import.meta.env.VITE_API_URL;

export const validateCoupon = async (code, id_user, token) => {
  const res = await fetch(`${API}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, id_user }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.description || data.message || "Cupón no válido");
  return data.data; // { id_coupon, code, discount, discount_type }
};