import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

import { rateLimit } from "express-rate-limit";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    message: "Too many login/register attempts. Try again in 15 minutes.",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
export default router;
