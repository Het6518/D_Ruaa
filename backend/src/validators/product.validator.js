import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().optional(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.enum(["fragrance", "candle"], {
    errorMap: () => ({ message: "Category must be either 'fragrance' or 'candle'" }),
  }),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer").default(0),
  size: z.string().optional().nullable(),
  sizes: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  fragrance: z.string().optional().nullable(),
  fragranceFamily: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  profile: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  notes: z.union([
    z.object({
      top: z.array(z.string()).optional(),
      heart: z.array(z.string()).optional(),
      base: z.array(z.string()).optional(),
    }),
    z.string(),
  ]).optional().nullable(),
  applications: z.union([z.array(z.string()), z.string()]).optional().nullable(),
  usageInfo: z.string().optional().nullable(),
  burnTime: z.string().optional().nullable(),
  waxType: z.string().optional().nullable(),
  imageUrl: z.string().url("Please provide a valid image URL").optional().nullable().or(z.literal("")),
  images: z.array(z.string()).optional().nullable(),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const productStatusSchema = z.object({
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
});
