import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { adminProductsApi } from "../../utils/api";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { usePageMeta } from "../../utils/usePageMeta";
import type { ProductCategory } from "../../types/product";

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  usePageMeta(
    isEditing ? "Edit Product | Admin Portal" : "Add Product | Admin Portal",
    "Product creation and editing form."
  );

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ProductCategory>("fragrance");
  const [price, setPrice] = useState<string>("45.00");
  const [stock, setStock] = useState<string>("20");
  const [size, setSize] = useState("100 ml");
  const [sizesInput, setSizesInput] = useState("50 ml, 100 ml");
  const [fragranceFamily, setFragranceFamily] = useState("Woody");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [profileInput, setProfileInput] = useState("Warm, Woody");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [applicationsInput, setApplicationsInput] = useState("Diffusers, Home fragrance");
  const [ingredients, setIngredients] = useState("");
  const [burnTime, setBurnTime] = useState("");
  const [waxType, setWaxType] = useState("");
  const [imagesInput, setImagesInput] = useState("https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80");
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch product if in edit mode
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await adminProductsApi.getById(id);
        if (data) {
          setName(data.name || "");
          setSlug(data.slug || "");
          setCategory(data.category || "fragrance");
          setPrice(String((data as any).price ?? "45.00"));
          setStock(String((data as any).stock ?? "20"));
          setSize((data as any).size || "");
          setSizesInput(Array.isArray(data.sizes) ? data.sizes.join(", ") : "");
          setFragranceFamily(data.fragranceFamily || "");
          setShortDescription(data.shortDescription || "");
          setDescription(data.description || "");
          setProfileInput(Array.isArray(data.profile) ? data.profile.join(", ") : "");
          setTopNotes(Array.isArray(data.notes?.top) ? data.notes.top.join(", ") : "");
          setHeartNotes(Array.isArray(data.notes?.heart) ? data.notes.heart.join(", ") : "");
          setBaseNotes(Array.isArray(data.notes?.base) ? data.notes.base.join(", ") : "");
          setApplicationsInput(Array.isArray(data.applications) ? data.applications.join(", ") : "");
          setIngredients((data as any).ingredients || "");
          setBurnTime(data.burnTime || "");
          setWaxType(data.waxType || "");
          setImagesInput(Array.isArray(data.images) ? data.images.join("\n") : "");
          setFeatured(Boolean(data.featured));
          setIsActive((data as any).isActive !== false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product for editing.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError("Product Name is required.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Please enter a valid stock amount.");
      return;
    }

    // Parse array inputs
    const parsedSizes = sizesInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedProfile = profileInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedApplications = applicationsInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedImages = imagesInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedNotes = {
      top: topNotes.split(",").map((s) => s.trim()).filter(Boolean),
      heart: heartNotes.split(",").map((s) => s.trim()).filter(Boolean),
      base: baseNotes.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const payload: any = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      category,
      price: parsedPrice,
      stock: parsedStock,
      size: size.trim() || undefined,
      sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
      fragranceFamily: fragranceFamily.trim() || undefined,
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      profile: parsedProfile.length > 0 ? parsedProfile : undefined,
      notes: parsedNotes,
      applications: parsedApplications.length > 0 ? parsedApplications : undefined,
      ingredients: ingredients.trim() || undefined,
      burnTime: burnTime.trim() || undefined,
      waxType: waxType.trim() || undefined,
      imageUrl: parsedImages[0] || undefined,
      images: parsedImages.length > 0 ? parsedImages : undefined,
      featured,
      isActive,
    };

    try {
      setSubmitting(true);

      if (isEditing && id) {
        await adminProductsApi.update(id, payload);
        setSuccessMessage("Product updated successfully!");
      } else {
        await adminProductsApi.create(payload);
        setSuccessMessage("Product created successfully!");
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  // Image preview list
  const previewImages = imagesInput
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("http") || s.startsWith("/"));

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-24 flex justify-center">
          <LoadingSpinner fullPage={false} message="Loading product data..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-border bg-ivory hover:bg-cream rounded transition text-charcoal"
            title="Back to products list"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="eyebrow">{isEditing ? "Edit Catalogue Item" : "Create New Item"}</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">
              {isEditing ? `Edit: ${name || "Product"}` : "Add New Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 border border-border bg-ivory hover:bg-cream text-xs font-semibold uppercase tracking-wider text-charcoal"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-charcoal text-ivory hover:bg-cocoa px-5 py-2 text-xs font-semibold uppercase tracking-wider transition disabled:opacity-60"
          >
            <Save size={15} />
            <span>{submitting ? "Saving..." : isEditing ? "Update Product" : "Publish Product"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mt-6 p-4 bg-clay/10 border border-clay/30 text-charcoal flex items-start gap-3">
          <AlertCircle size={18} className="text-clay shrink-0 mt-0.5" />
          <div className="text-xs leading-5">
            <span className="font-semibold text-clay">Validation/Server Error: </span>
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">{successMessage}</div>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Left Column: Basic & Scent details */}
        <div className="space-y-6">
          {/* General Information Card */}
          <div className="bg-ivory border border-border p-6 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-charcoal pb-2 border-b border-border">
              Product Overview
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vanilla Oud Fragrance"
                className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                >
                  <option value="fragrance">Fragrance Material</option>
                  <option value="candle">Scented Candle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Auto-generated if blank"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal font-mono placeholder:font-sans focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45.00"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Stock Units *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="20"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Primary Size
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 100 ml or 200 g"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Short Description (Card Teaser)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A warm profile with creamy sweetness and a deeper woody character."
                className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed scent story, inspiration, crafting details..."
                className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
              />
            </div>
          </div>

          {/* Olfactory & Formulation Details */}
          <div className="bg-ivory border border-border p-6 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-charcoal pb-2 border-b border-border">
              Scent & Profile Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Fragrance Family
                </label>
                <input
                  type="text"
                  value={fragranceFamily}
                  onChange={(e) => setFragranceFamily(e.target.value)}
                  placeholder="e.g. Woody, Floral, Citrus, Oriental"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Profile Badges (Comma-separated)
                </label>
                <input
                  type="text"
                  value={profileInput}
                  onChange={(e) => setProfileInput(e.target.value)}
                  placeholder="e.g. Warm, Sweet, Woody"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
                />
              </div>
            </div>

            {/* Fragrance Pyramid Notes */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-clay mb-2">
                Olfactory Notes Pyramid (Comma-separated)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-muted mb-1">Top Notes</label>
                  <input
                    type="text"
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                    placeholder="e.g. Fresh petals, Citrus"
                    className="w-full bg-cream/30 border border-border px-3 py-2 text-xs text-charcoal focus:border-clay outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted mb-1">Heart Notes</label>
                  <input
                    type="text"
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                    placeholder="e.g. Rose, Vanilla"
                    className="w-full bg-cream/30 border border-border px-3 py-2 text-xs text-charcoal focus:border-clay outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted mb-1">Base Notes</label>
                  <input
                    type="text"
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                    placeholder="e.g. Clean musk, Woods"
                    className="w-full bg-cream/30 border border-border px-3 py-2 text-xs text-charcoal focus:border-clay outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Available Sizes
                </label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="50 ml, 100 ml, 500 ml"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Applications / Usage
                </label>
                <input
                  type="text"
                  value={applicationsInput}
                  onChange={(e) => setApplicationsInput(e.target.value)}
                  placeholder="Candle making, Diffusers, Home"
                  className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay outline-none"
                />
              </div>
            </div>

            {category === "candle" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Burn Time (Candles)
                  </label>
                  <input
                    type="text"
                    value={burnTime}
                    onChange={(e) => setBurnTime(e.target.value)}
                    placeholder="Approx 45 hours"
                    className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Wax & Wick Type
                  </label>
                  <input
                    type="text"
                    value={waxType}
                    onChange={(e) => setWaxType(e.target.value)}
                    placeholder="Soy wax blend with cotton wick"
                    className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-sm text-charcoal focus:border-clay outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Imagery & Visibility */}
        <div className="space-y-6">
          {/* Visibility & Status Card */}
          <div className="bg-ivory border border-border p-6 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-charcoal pb-2 border-b border-border">
              Visibility & Flags
            </h2>

            <label className="flex items-start gap-3 p-3 bg-cream/40 border border-border cursor-pointer hover:bg-cream/70 transition">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-clay"
              />
              <div>
                <span className="text-sm font-semibold text-charcoal">Active in Storefront</span>
                <p className="text-xs text-muted">When enabled, customers can discover and view this product.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-cream/40 border border-border cursor-pointer hover:bg-cream/70 transition">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-clay"
              />
              <div>
                <span className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
                  <Sparkles size={14} className="text-clay fill-clay" />
                  Featured Collection Highlight
                </span>
                <p className="text-xs text-muted">Feature this scent in the curated homepage showcase.</p>
              </div>
            </label>
          </div>

          {/* Imagery Card */}
          <div className="bg-ivory border border-border p-6 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-charcoal pb-2 border-b border-border flex items-center gap-2">
              <ImageIcon size={18} />
              <span>Product Images</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Image URLs (One per line)
              </label>
              <textarea
                rows={4}
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-cream/30 border border-border px-3.5 py-2.5 text-xs font-mono text-charcoal focus:border-clay focus:bg-ivory outline-none transition"
              />
              <p className="text-[11px] text-muted mt-1">
                The first image will be used as the primary card photo.
              </p>
            </div>

            {/* Live Visual Previews */}
            {previewImages.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  Image Previews ({previewImages.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative aspect-square bg-cream border border-border overflow-hidden group">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/c1.jpeg";
                        }}
                      />
                      <span className="absolute bottom-1 left-1 bg-charcoal/80 text-ivory text-[10px] px-1.5 py-0.5 rounded">
                        {i === 0 ? "Primary" : `#${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-charcoal text-ivory hover:bg-cocoa py-4 px-6 text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
          >
            <Save size={16} />
            <span>{submitting ? "Saving to Database..." : isEditing ? "Save Product Changes" : "Create Product in Database"}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
