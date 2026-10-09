import prisma from "../config/prisma.js";
import { generateSlug } from "../utils/slug.js";
import { productSchema, productStatusSchema } from "../validators/product.validator.js";

// Helper to format product data for client response
const formatProduct = (product) => {
  if (!product) return null;
  const images = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : product.imageUrl
    ? [product.imageUrl]
    : [];

  return {
    ...product,
    images: images.length > 0 ? images : ["/c1.jpeg"],
  };
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

export const getPublicProducts = async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;

    const where = {
      isActive: true,
    };

    if (category && (category === "fragrance" || category === "candle")) {
      where.category = category;
    }

    if (featured !== undefined) {
      where.featured = featured === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { fragranceFamily: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, activeProducts, featuredProducts, fragrances, candles, outOfStock] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { featured: true } }),
        prisma.product.count({ where: { category: "fragrance" } }),
        prisma.product.count({ where: { category: "candle" } }),
        prisma.product.count({ where: { stock: 0 } }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        fragrances,
        candles,
        outOfStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { category, search, status, sort = "desc" } = req.query;

    const where = {};

    if (category && (category === "fragrance" || category === "candle")) {
      where.category = category;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { fragranceFamily: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
    });

    return res.status(200).json({
      success: true,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);

    // Generate unique slug
    let baseSlug = validatedData.slug ? generateSlug(validatedData.slug) : generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Extract image list
    const imageList = Array.isArray(validatedData.images) && validatedData.images.length > 0
      ? validatedData.images.filter(Boolean)
      : validatedData.imageUrl
      ? [validatedData.imageUrl]
      : [];

    const primaryImageUrl = imageList[0] || validatedData.imageUrl || null;

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
        shortDescription: validatedData.shortDescription || null,
        description: validatedData.description || null,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        size: validatedData.size || null,
        sizes: validatedData.sizes || null,
        fragrance: validatedData.fragrance || null,
        fragranceFamily: validatedData.fragranceFamily || null,
        ingredients: validatedData.ingredients || null,
        profile: validatedData.profile || null,
        notes: validatedData.notes || null,
        applications: validatedData.applications || null,
        usageInfo: validatedData.usageInfo || null,
        burnTime: validatedData.burnTime || null,
        waxType: validatedData.waxType || null,
        imageUrl: primaryImageUrl,
        featured: validatedData.featured,
        isActive: validatedData.isActive,
        images: {
          create: imageList.map((url) => ({
            url,
            altText: `${validatedData.name} image`,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Handle slug update if provided and different
    let slug = existingProduct.slug;
    if (validatedData.slug && validatedData.slug !== existingProduct.slug) {
      let baseSlug = generateSlug(validatedData.slug);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const check = await prisma.product.findUnique({ where: { slug } });
        if (!check || check.id === id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Extract image list
    const imageList = Array.isArray(validatedData.images) && validatedData.images.length > 0
      ? validatedData.images.filter(Boolean)
      : validatedData.imageUrl
      ? [validatedData.imageUrl]
      : [];

    const primaryImageUrl = imageList[0] || validatedData.imageUrl || existingProduct.imageUrl;

    // Delete existing product images and recreate
    if (imageList.length > 0) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        shortDescription: validatedData.shortDescription || null,
        description: validatedData.description || null,
        price: validatedData.price,
        category: validatedData.category,
        stock: validatedData.stock,
        size: validatedData.size || null,
        sizes: validatedData.sizes || null,
        fragrance: validatedData.fragrance || null,
        fragranceFamily: validatedData.fragranceFamily || null,
        ingredients: validatedData.ingredients || null,
        profile: validatedData.profile || null,
        notes: validatedData.notes || null,
        applications: validatedData.applications || null,
        usageInfo: validatedData.usageInfo || null,
        burnTime: validatedData.burnTime || null,
        waxType: validatedData.waxType || null,
        imageUrl: primaryImageUrl,
        featured: validatedData.featured,
        isActive: validatedData.isActive,
        ...(imageList.length > 0 && {
          images: {
            create: imageList.map((url) => ({
              url,
              altText: `${validatedData.name} image`,
            })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: formatProduct(updatedProduct),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: `Product "${existingProduct.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = productStatusSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        images: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully.",
      data: formatProduct(updatedProduct),
    });
  } catch (error) {
    next(error);
  }
};
