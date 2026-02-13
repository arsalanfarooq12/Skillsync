import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./src/routes/authRoutes.js";
import skillRoutes from "./src/routes/skillRoutes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(generalLimiter);

app.get("/api/health", (req, res) => {
  return res.json({ test: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` SkillSync Backend running on port ${PORT}`)
);
