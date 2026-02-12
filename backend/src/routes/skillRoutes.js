import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import { createSkill } from "../controllers/skillController.js";

const router = express.Router();

router.post("/add", protect, createSkill);

export default router;
