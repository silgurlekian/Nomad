import express from "express";
import {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
  uploadSpaceImage,
} from "../controllers/spaceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getSpaces);
router.get("/:id", getSpaceById);

// Protected routes
router.use(protect);
router.post("/", uploadSpaceImage, createSpace);
router.put("/:id", uploadSpaceImage, updateSpace);
router.delete("/:id", deleteSpace);

export default router;