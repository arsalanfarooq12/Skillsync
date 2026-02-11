import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
} from "../middlewares/validators.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
