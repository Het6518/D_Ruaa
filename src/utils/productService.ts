import { useEffect, useState } from "react";
import { products as fallbackProducts } from "../data/products";
import { publicProductsApi } from "./api";
import type { Product, ProductCategory } from "../types/product";

let cachedProducts: Product[] = fallbackProducts;

export const getProducts = () => cachedProducts;
export const getProductBySlug = (slug: string) => cachedProducts.find((product) => product.slug === slug);
export const getFeaturedProducts = () => cachedProducts.filter((product) => product.featured);
export const getProductsByCategory = (category: ProductCategory) => cachedProducts.filter((product) => product.category === category);

export const getRelatedProducts = (product: Product, limit = 4) =>
  cachedProducts
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const scoreA = Number(a.category === product.category) + Number(a.fragranceFamily === product.fragranceFamily);
      const scoreB = Number(b.category === product.category) + Number(b.fragranceFamily === product.fragranceFamily);
      return scoreB - scoreA;
    })
    .slice(0, limit);

// React Hooks for dynamic API data fetching
export function useProducts(params?: { category?: ProductCategory; featured?: boolean; search?: string }) {
  const [data, setData] = useState<Product[]>(cachedProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    publicProductsApi
      .getAll(params)
      .then((apiProducts) => {
        if (isMounted) {
          if (apiProducts && apiProducts.length > 0) {
            cachedProducts = apiProducts;
            setData(apiProducts);
          } else {
            setData(fallbackProducts);
          }
          setError(null);
        }
      })
      .catch((err) => {
        console.warn("API unavailable, falling back to local catalogue data:", err.message);
        if (isMounted) {
          setData(fallbackProducts);
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [params?.category, params?.featured, params?.search]);

  return { products: data, loading, error };
}

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<Product | undefined>(() => getProductBySlug(slug));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    publicProductsApi
      .getBySlug(slug)
      .then((apiProduct) => {
        if (isMounted) {
          setProduct(apiProduct);
          setError(null);
        }
      })
      .catch((err) => {
        console.warn(`Could not load product "${slug}" from API, checking local data:`, err.message);
        if (isMounted) {
          const fallback = fallbackProducts.find((p) => p.slug === slug);
          setProduct(fallback);
          if (!fallback) {
            setError(err.message);
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { product, loading, error };
}
