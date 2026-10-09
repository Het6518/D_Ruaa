import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminProductsApi } from "../../utils/api";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { usePageMeta } from "../../utils/usePageMeta";
import type { Product } from "../../types/product";

export function AdminProductList() {
  usePageMeta("Products Management | Admin Portal", "Manage, edit, activate and delete fragrance and candle products.");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status updating state map (to prevent multiple clicks)
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminProductsApi.getAll();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load products from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products locally for instant response
  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (p as any).isActive !== false) ||
      (statusFilter === "inactive" && (p as any).isActive === false);

    const text = [p.name, p.slug, p.shortDescription, p.fragranceFamily || ""].join(" ").toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = async (product: Product) => {
    const newStatus = !(product as any).isActive;
    try {
      setUpdatingId(product.id);
      const updated = await adminProductsApi.updateStatus(product.id, { isActive: newStatus });
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, isActive: updated.isActive } : item))
      );
    } catch (err: any) {
      alert(`Error updating product status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const newFeatured = !product.featured;
    try {
      setUpdatingId(product.id);
      const updated = await adminProductsApi.updateStatus(product.id, { featured: newFeatured });
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, featured: updated.featured } : item))
      );
    } catch (err: any) {
      alert(`Error updating featured status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      await adminProductsApi.delete(productToDelete.id);
      setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err: any) {
      alert(`Could not delete product: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <p className="eyebrow">Catalogue Inventory</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-charcoal">
            Products Management
          </h1>
          <p className="text-sm text-muted mt-1">
            Dynamic control of fragrance materials and scented candles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 border border-border bg-ivory hover:bg-cream text-charcoal transition rounded"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-charcoal text-ivory hover:bg-cocoa px-5 py-2.5 text-sm font-semibold transition shadow-sm"
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by product name, scent family, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ivory border border-border pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:border-clay focus:ring-1 focus:ring-clay outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center bg-cream/70 border border-border p-1 gap-1">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              categoryFilter === "all" ? "bg-ivory text-charcoal shadow-xs" : "text-muted hover:text-charcoal"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter("fragrance")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              categoryFilter === "fragrance" ? "bg-ivory text-charcoal shadow-xs" : "text-muted hover:text-charcoal"
            }`}
          >
            Fragrances
          </button>
          <button
            onClick={() => setCategoryFilter("candle")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              categoryFilter === "candle" ? "bg-ivory text-charcoal shadow-xs" : "text-muted hover:text-charcoal"
            }`}
          >
            Candles
          </button>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ivory border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal focus:border-clay outline-none"
        >
          <option value="all">Status: All</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-clay/10 border border-clay/30 text-charcoal flex items-center gap-3">
          <AlertCircle size={18} className="text-clay shrink-0" />
          <p className="text-xs leading-5">
            <span className="font-semibold text-clay">Connection Note: </span>
            {error}
          </p>
        </div>
      )}

      {/* Products Table */}
      <div className="mt-6 bg-ivory border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner fullPage={false} message="Loading catalogue..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-border bg-linen/50 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted">
                      <p className="font-display text-xl text-charcoal font-semibold">No products match your filter.</p>
                      <p className="text-xs mt-1">Try clearing your search query or add a new product.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isActive = (product as any).isActive !== false;
                    const isFeatured = !!product.featured;
                    const isUpdating = updatingId === product.id;

                    return (
                      <tr key={product.id} className="hover:bg-cream/30 transition">
                        {/* Image & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0] || "/c1.jpeg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded bg-cream border border-border shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-charcoal truncate">{product.name}</p>
                              <p className="text-xs text-muted font-mono truncate">{product.slug}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-xs uppercase font-medium px-2.5 py-0.5 rounded-full border ${
                              product.category === "fragrance"
                                ? "bg-linen/70 border-border text-clay font-semibold"
                                : "bg-cream border-border text-cocoa font-semibold"
                            }`}
                          >
                            {product.category === "fragrance" ? "Fragrance" : "Candle"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-semibold text-charcoal">
                          {(product as any).price ? `$${(product as any).price.toFixed(2)}` : "—"}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 text-xs">
                          <span
                            className={`font-semibold ${
                              Number((product as any).stock) === 0 ? "text-red-600" : "text-charcoal"
                            }`}
                          >
                            {(product as any).stock ?? 0} units
                          </span>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            disabled={isUpdating}
                            className={`p-1.5 rounded transition ${
                              isFeatured
                                ? "text-clay bg-clay/10 hover:bg-clay/20"
                                : "text-muted/50 hover:text-charcoal hover:bg-cream"
                            }`}
                            title={isFeatured ? "Featured (Click to unfeature)" : "Click to mark as featured"}
                          >
                            <Sparkles size={18} className={isFeatured ? "fill-clay" : ""} />
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(product)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                              isActive
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                            }`}
                            title={isActive ? "Active in store (Click to deactivate)" : "Inactive (Click to publish)"}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle size={13} className="text-emerald-600" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={13} className="text-gray-500" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/product/${product.slug}`}
                              target="_blank"
                              className="p-1.5 text-muted hover:text-charcoal hover:bg-cream rounded transition"
                              title="View on Storefront"
                            >
                              <ExternalLink size={15} />
                            </Link>
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-1.5 text-charcoal hover:text-clay hover:bg-cream rounded transition"
                              title="Edit Product"
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 border-t border-border bg-linen/20 text-xs text-muted flex items-center justify-between">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> total products
          </span>
          <Link to="/admin/products/new" className="text-clay font-semibold hover:underline">
            + Create New Item
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        productName={productToDelete?.name || ""}
        isLoading={deleting}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
