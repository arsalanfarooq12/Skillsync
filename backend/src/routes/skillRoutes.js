import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import { createSkill, getAllSkills } from "../controllers/skillController.js";

const router = express.Router();
router.get("/", getAllSkills);
router.post("/add", protect, createSkill);

export default router;
