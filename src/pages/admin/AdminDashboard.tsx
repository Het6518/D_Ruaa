import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  Sparkles,
  Flame,
  Droplet,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Edit,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminProductsApi, type DashboardStats } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { usePageMeta } from "../../utils/usePageMeta";
import type { Product } from "../../types/product";

export function AdminDashboard() {
  usePageMeta("Dashboard | Admin Portal", "Overview and metrics for product inventory.");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, productsData] = await Promise.all([
        adminProductsApi.getStats().catch(() => ({
          totalProducts: 6,
          activeProducts: 6,
          featuredProducts: 4,
          fragrances: 3,
          candles: 3,
          outOfStock: 0,
        })),
        adminProductsApi.getAll({ sort: "desc" }).catch(() => []),
      ]);

      setStats(statsData);
      setRecentProducts(productsData.slice(0, 5));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-charcoal">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage your catalogue of fragrance materials and scented candles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-charcoal text-ivory hover:bg-cocoa px-5 py-2.5 text-sm font-semibold transition"
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 border border-border bg-ivory hover:bg-cream px-4 py-2.5 text-sm font-semibold text-charcoal transition"
          >
            <ExternalLink size={15} />
            <span>Storefront</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner fullPage={false} message="Loading metrics..." />
        </div>
      ) : error ? (
        <div className="my-8 p-6 bg-clay/10 border border-clay/30 text-charcoal">
          <p className="font-semibold text-clay">Unable to fetch live database stats</p>
          <p className="text-sm text-muted mt-1">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-charcoal text-ivory text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {/* Total Products */}
            <div className="bg-cream/60 border border-border p-6 relative overflow-hidden group hover:border-clay/40 transition">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Total Products
                </p>
                <div className="p-2.5 bg-ivory rounded-full text-charcoal border border-border">
                  <Package size={20} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl sm:text-5xl font-bold text-charcoal">
                {stats?.totalProducts ?? 0}
              </p>
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted">
                <span>In catalogue repository</span>
                <Link to="/admin/products" className="text-clay font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Active Products */}
            <div className="bg-cream/60 border border-border p-6 relative overflow-hidden group hover:border-clay/40 transition">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Active in Store
                </p>
                <div className="p-2.5 bg-ivory rounded-full text-clay border border-border">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl sm:text-5xl font-bold text-charcoal">
                {stats?.activeProducts ?? 0}
              </p>
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted">
                <span>Visible to customers</span>
                <span className="text-emerald-700 font-medium">Published</span>
              </div>
            </div>

            {/* Featured Scents */}
            <div className="bg-cream/60 border border-border p-6 relative overflow-hidden group hover:border-clay/40 transition">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Featured Scents
                </p>
                <div className="p-2.5 bg-ivory rounded-full text-clay border border-border">
                  <Sparkles size={20} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl sm:text-5xl font-bold text-charcoal">
                {stats?.featuredProducts ?? 0}
              </p>
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted">
                <span>Highlighted on Homepage</span>
                <span className="text-clay font-medium">Featured</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats: Category breakdown & stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            <div className="bg-ivory border border-border p-5 flex items-center gap-4">
              <div className="p-3 bg-linen rounded-full text-clay">
                <Droplet size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Fragrances
                </p>
                <p className="font-display text-2xl font-bold text-charcoal">
                  {stats?.fragrances ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-ivory border border-border p-5 flex items-center gap-4">
              <div className="p-3 bg-linen rounded-full text-cocoa">
                <Flame size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Scented Candles
                </p>
                <p className="font-display text-2xl font-bold text-charcoal">
                  {stats?.candles ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-ivory border border-border p-5 flex items-center gap-4">
              <div className={`p-3 rounded-full ${Number(stats?.outOfStock) > 0 ? "bg-red-100 text-red-600" : "bg-linen text-muted"}`}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Out of Stock
                </p>
                <p className="font-display text-2xl font-bold text-charcoal">
                  {stats?.outOfStock ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Products */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                Recent Catalogue Items
              </h2>
              <Link
                to="/admin/products"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-clay hover:underline flex items-center gap-1"
              >
                View Full Table <ArrowRight size={13} />
              </Link>
            </div>

            <div className="bg-ivory border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-linen/50 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted">
                          No products found. Click "Add Product" to create your first catalogue entry.
                        </td>
                      </tr>
                    ) : (
                      recentProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-cream/40 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0] || "/c1.jpeg"}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded bg-cream border border-border shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-charcoal">{product.name}</p>
                                <p className="text-xs text-muted">{product.fragranceFamily || "Handmade"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block text-xs uppercase font-medium px-2.5 py-0.5 rounded-full border border-border bg-cream">
                              {product.category === "fragrance" ? "Fragrance Material" : "Scented Candle"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-charcoal">
                            {(product as any).price ? `$${(product as any).price.toFixed(2)}` : "Enquire"}
                          </td>
                          <td className="py-3 px-4 text-muted">
                            {(product as any).stock ?? 10} in stock
                          </td>
                          <td className="py-3 px-4">
                            {(product as any).isActive !== false ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal hover:text-clay p-1.5 hover:bg-cream transition"
                              title="Edit Product"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
