import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/users", protectedRoute, getUsersForSidebar);
router.post("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);

export default router;
