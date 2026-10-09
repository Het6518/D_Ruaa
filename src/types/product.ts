export type ProductCategory = "fragrance" | "candle"; // category of product, either fragrance materials or scented candles

export type ProductNotes = {
  top?: string[];
  heart?: string[];
  base?: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price?: number;
  stock?: number;
  size?: string;
  shortDescription: string;
  description?: string;
  fragranceFamily?: string;
  ingredients?: string;
  profile?: string[];
  notes?: ProductNotes;
  sizes?: string[];
  applications?: string[];
  usageInfo?: string;
  burnTime?: string;
  waxType?: string;
  imageUrl?: string;
  images: string[];
  featured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
