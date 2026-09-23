import { products } from "../data/products";
import type { Product, ProductCategory } from "../types/product";

export const getProducts = () => products;
export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const getFeaturedProducts = () => products.filter((product) => product.featured);
export const getProductsByCategory = (category: ProductCategory) => products.filter((product) => product.category === category);

export const getRelatedProducts = (product: Product, limit = 4) =>
  products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const scoreA = Number(a.category === product.category) + Number(a.fragranceFamily === product.fragranceFamily);
      const scoreB = Number(b.category === product.category) + Number(b.fragranceFamily === product.fragranceFamily);
      return scoreB - scoreA;
    }) //here we are sorting the products based on their similarity to the given product. The similarity is determined by checking if the category and fragrance family match. The products with the highest similarity score will be at the top of the list.
    .slice(0, limit);
