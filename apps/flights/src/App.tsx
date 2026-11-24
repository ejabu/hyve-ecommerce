import { Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import { CheckoutPage } from "./pages/checkout-page";
import { ResultsPage } from "./pages/results-page";
import { SearchPage } from "./pages/search-page";
import { ShopPage } from "./pages/shop-page";
import { TripPage } from "./pages/trip-page";
import { TripsPage } from "./pages/trips-page";

export function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/flights" element={<ResultsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:id" element={<TripPage />} />
          <Route path="*" element={<p className="muted">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
