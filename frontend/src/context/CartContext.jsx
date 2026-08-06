import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const API = import.meta.env.VITE_API_URL;
const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, checkingAuth, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [idCart, setIdCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const fetchCartId = async () => {
    if (!user) return null;
    try {
      const res = await fetch(`${API}/shopping_carts/user/${user.id_user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setIdCart(data.data.id_cart);
        return data.data.id_cart;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener id_cart:", error);
      return null;
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/cart_items?user_id=${user.id_user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.data);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error al traer el carrito:", error.message, error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (id_product) => {
    if (!user) {
      alert("Tenés que iniciar sesión para agregar al carrito.");
      return;
    }
    try {
      const cartRes = await fetch(`${API}/shopping_carts/user/${user.id_user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cartData = await cartRes.json();

      if (!cartRes.ok) {
        console.error("No se encontró el carrito del usuario");
        return;
      }
      const id_cart = cartData.data.id_cart;
      setIdCart(id_cart);

      const res = await fetch(`${API}/cart_items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_cart, id_product, quantity: 1 }),
      });

      if (res.ok) {
        await fetchCart();
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const removeFromCart = async (id_item) => {
    try {
      const res = await fetch(`${API}/cart_items/${id_item}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCart((prev) => prev.filter((item) => item.id_item !== id_item));
      }
    } catch (error) {
      console.error("Error al eliminar item del carrito:", error);
    }
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    if (!checkingAuth && user) {
      fetchCartId();
      fetchCart();
    }
  }, [user, checkingAuth]);

  return (
    <CartContext.Provider value={{ cart, setCart, idCart, loading, fetchCart, clearCart, removeFromCart, isOpen, toggleCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);