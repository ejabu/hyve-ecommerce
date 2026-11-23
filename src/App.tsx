import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { HomePage } from "./pages/home-page";
import { OrdersPage } from "./pages/orders-page";
import { ProductPage } from "./pages/product-page";

export function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<p className="empty">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
