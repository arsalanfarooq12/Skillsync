import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  createSkill,
  getAllSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { validate } from "../middlewares/validate.js";
import { createSkillSchema } from "../validations/skillValidation.js";

const router = express.Router();
router.get("/", getAllSkills);

router.post("/add", protect, validate(createSkillSchema), createSkill);
router.patch("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);
export default router;
