import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
// import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SignatureSplash } from "./components/SignatureSplash";
import { About } from "./pages/About";
import { Catalogue } from "./pages/Catalogue";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { ProductDetails } from "./pages/ProductDetails";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProductList } from "./pages/admin/AdminProductList";
import { AdminProductForm } from "./pages/admin/AdminProductForm";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col justify-between">
      {!isAdminRoute && <SignatureSplash duration={5500} />}
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer Storefront Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/fragrances" element={<Catalogue fixedCategory="fragrance" />} />
        <Route path="/candles" element={<Catalogue fixedCategory="candle" />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute>
              <AdminProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <ProtectedRoute>
              <AdminProductForm />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && <Footer />}
      {/*<Analytics />*/}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <MainLayout />
    </AdminAuthProvider>
  );
}
