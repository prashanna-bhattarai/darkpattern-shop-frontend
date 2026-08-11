import { useEffect } from "react";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    checkAuth().then(() => fetchCart());
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </>
  );
}

export default App;
