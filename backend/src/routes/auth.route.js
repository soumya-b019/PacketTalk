import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.patch("/update-profile", protectedRoute, updateProfile);

// to check authentication when user refreshes the page
router.get("/check", protectedRoute, checkAuth);

export default router;
