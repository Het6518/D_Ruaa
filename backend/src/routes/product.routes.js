import { Router } from "express";
import {
  getPublicProducts,
  getPublicProductBySlug,
  getDashboardStats,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// ==========================================
// PUBLIC ROUTES
// Mounted at /api/products
// ==========================================
router.get("/", getPublicProducts);
router.get("/:slug", getPublicProductBySlug);

// ==========================================
// ADMIN ROUTES (Exported separately or mounted at /api/admin/products)
// ==========================================
export const adminProductRouter = Router();

// Apply auth & admin middlewares to all admin routes
adminProductRouter.use(authenticate, requireAdmin);

adminProductRouter.get("/stats", getDashboardStats);
adminProductRouter.get("/", getAdminProducts);
adminProductRouter.get("/:id", getAdminProductById);
adminProductRouter.post("/", createProduct);
adminProductRouter.put("/:id", updateProduct);
adminProductRouter.delete("/:id", deleteProduct);
adminProductRouter.patch("/:id/status", updateProductStatus);

export default router;
