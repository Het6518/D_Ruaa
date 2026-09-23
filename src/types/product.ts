export type ProductCategory = "fragrance" | "candle"; // category of product, either fragrance materials or scented candles

export type ProductNotes = {
  top?: string[];
  heart?: string[];
  base?: string[];
};
//notes
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description?: string;
  fragranceFamily?: string;
  profile?: string[];
  notes?: ProductNotes;
  sizes?: string[];
  applications?: string[];
  usageInfo?: string;
  burnTime?: string;
  waxType?: string;
  images: string[];
  featured?: boolean;
};
