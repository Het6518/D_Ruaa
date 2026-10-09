import { Router } from "express";
import { register, login, getMe, setupDefaultAdmin } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/setup-admin", setupDefaultAdmin);

export default router;
