import express from "express";
import {
  getAllSpacesType,
  getSpaceTypeById,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType,
} from "../controllers/spaceTypeController.js";

const router = express.Router();

router.get("/", getAllSpacesType);
router.get("/:id", getSpaceTypeById);
router.post("/", createSpaceType);
router.put("/:id", updateSpaceType);
router.delete("/:id", deleteSpaceType); 

export default router;
