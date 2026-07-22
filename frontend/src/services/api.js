const API_URL = import.meta.env.VITE_API_URL;

// helper
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en ${endpoint}`);
    }

    const data = await response.json().catch(() => ({}));
    return data.data || data;
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error.message);
    throw error;
  }
}

//
// 🛍️ PRODUCTOS
//

export const getProducts = (query = "") => request(`/products${query}`);

export const getProductById = (id) => request(`/products/${id}`);

export const searchProducts = (query) =>
  request(`/products/search?q=${encodeURIComponent(query)}`);

//
// 🧩 CATEGORÍAS / FILTROS
//

export const getCategories = () => request("/categories");

export const getColors = () => request("/colors");

export const getKeywords = () => request("/keywords");

export const getSeries = () => request("/series");

//
//  USUARIOS
//

export const registerUser = (userData) =>
  request("/users/", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = (credentials) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const logoutUser = () =>
  request("/users/logout", { method: "POST" });

export const getUserProfile = (token) =>
  request("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const changePassword = (token, passwords) =>
  request("/users/change-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(passwords),
  });

export const forgotPassword = (email) =>
  request("/users/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, newPassword) =>
  request(`/users/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password: newPassword }),
  });

//
// FAVORITOS
//

export const getFavoriteProducts = (token, userId) =>
  request(`/favorite_products?id_user=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const addFavoriteProduct = async (token, userId, productId) => {
    const response = await fetch(`${API_URL}/favorite_products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_product: productId }),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Error al agregar favorito");
    return data;
  };

export const removeFavoriteProduct = (token, productId) =>
  request(`/favorite_products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

//
// ALIASES LIMPIOS (para el context)
//

export const getFavorites = getFavoriteProducts;
export const addFavorite = addFavoriteProduct;
export const removeFavorite = removeFavoriteProduct;

//
//  CARRITO
//

export const getCart = (token) =>
  request("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = (token, productId, quantity = 1) =>
  request("/cart", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

export const removeFromCart = (token, productId) =>
  request(`/cart/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

export const checkout = (token, data) =>
  request("/cart/checkout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });


//
// PAGOS
//

export const createMPPreference = async (token, items, id_order) => {
  const response = await fetch(`${API_URL}/payments/mercadopago/preference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items, id_order }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Error al crear preferencia MP");
  return data;
};

export const createPayPalOrder = async (token, items, id_order) => {
  const response = await fetch(`${API_URL}/payments/paypal/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items, id_order }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Error al crear orden PayPal");
  return data;
};

export const getMyPurchases = (token) =>
  request("/orders/my-purchases", {
    headers: { Authorization: `Bearer ${token}` },
  });