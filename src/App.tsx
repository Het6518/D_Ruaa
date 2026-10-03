import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SignatureSplash } from "./components/SignatureSplash";
import { About } from "./pages/About";
import { Catalogue } from "./pages/Catalogue";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { ProductDetails } from "./pages/ProductDetails";

function ScrollToTop() {
  const { pathname } = useLocation(); // use location hook to get the current pathname provided by react router dom
  useEffect(() => {
    window.scrollTo(0, 0); // it will scroll to the top of the page whenever the pathname changes
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <SignatureSplash duration={5500} />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/fragrances" element={<Catalogue fixedCategory="fragrance" />} />
        <Route path="/candles" element={<Catalogue fixedCategory="candle" />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Analytics />
    </div>
  );
}
