import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import FavoritesProvider from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";

import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import CartSidebar from "./components/CartSidebar";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";

// Shop
import Shop from "./pages/Shop/Shop.jsx";
import Products from "./pages/Shop/Products.jsx";
import ProductDetail from "./pages/Shop/ProductDetail.jsx";
// import Keywords from "./pages/Shop/Keywords.jsx";
// import Series from "./pages/Shop/Series.jsx";
// import Colors from "./pages/Shop/Colors.jsx";
// import Animations from "./pages/Shop/Animations.jsx";
// import Style from "./pages/Shop/Style.jsx";
// import Theme from "./pages/Shop/Theme.jsx";

import Sold from "./pages/Sold.jsx";
import Lab from "./pages/Lab.jsx";
import Search from "./pages/Search.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Cart
import Checkout from "./pages/Cart/Checkout.jsx";
import CheckoutSuccess from "./pages/Cart/CheckoutSuccess.jsx";
import CheckoutFailure from "./pages/Cart/CheckoutFailure.jsx";
import CheckoutPending from "./pages/Cart/CheckoutPending.jsx";

// Account
import Login from "./pages/Account/Login.jsx";
import Register from "./pages/Account/Register.jsx";
import Logout from "./pages/Account/Logout.jsx";
import Profile from "./pages/Account/Profile.jsx";
import Favorites from "./pages/Account/Favorites.jsx";
import ChangePassword from "./pages/Account/ChangePassword.jsx";
import ForgotPassword from "./pages/Account/ForgotPassword.jsx";
import ResetPassword from "./pages/Account/ResetPassword.jsx";
import MyPurchases from "./pages/Account/MyPurchases.jsx";

// Admin
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminCreateProduct from "./pages/Admin/AdminCreateProduct";
import AdminColors from "./pages/Admin/AdminColors";
import AdminKeywords from "./pages/Admin/AdminKeywords";
import AdminSeries from "./pages/Admin/AdminSeries";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminCustomizations from "./pages/Admin/AdminCustomizations";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen">

                {/* Top layout */}
                <TopBar />
                <Navbar />
                <CartSidebar />

                {/* Main content */}
                <main className="pt-28 flex-grow">
                  <Routes>

                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* SHOP */}
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    {/* <Route path="/keywords" element={<Keywords />} />
                <Route path="/series" element={<Series />} /> */}
                    {/* <Route path="/products/animations" element={<Animations />} /> */}
                    {/* <Route path="/products/style" element={<Style />} /> */}
                    {/* <Route path="/products/theme" element={<Theme />} /> */}
                    {/* <Route path="/colors" element={<Colors />} /> */}

                    {/* Sold */}
                    <Route path="/sold" element={<Sold />} />

                    {/* Lab */}
                    <Route path="/lab" element={<Lab />} />

                    {/* Cart */}
                    {/* Cart */}
                    <Route path="/cart" element={<Navigate to="/cart/checkout" replace />} />
                    <Route path="/cart/checkout" element={<Checkout />} />
                    <Route path="/checkout/success" element={<CheckoutSuccess />} />
                    <Route path="/checkout/failure" element={<CheckoutFailure />} />
                    <Route path="/checkout/pending" element={<CheckoutPending />} />

                    {/* Search */}
                    <Route path="/search" element={<Search />} />

                    {/* Info */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Account - públicas */}
                    <Route path="/account/login" element={<Login />} />
                    <Route path="/account/register" element={<Register />} />
                    <Route path="/account/logout" element={<Logout />} />
                    <Route path="/account/forgot-password" element={<ForgotPassword />} />
                    <Route path="/account/reset-password/:token" element={<ResetPassword />} />


                    {/* Account - protegidas */}
                    <Route
                      path="/account/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/favorites"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/change-password"
                      element={
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account/my-purchases"
                      element={
                        <ProtectedRoute>
                          <MyPurchases />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute roles={["admin"]}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="create-product" element={<AdminCreateProduct />} />
                      <Route path="colors" element={<AdminColors />} />
                      <Route path="keywords" element={<AdminKeywords />} />
                      <Route path="series" element={<AdminSeries />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="customizations" element={<AdminCustomizations />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Footer */}
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;